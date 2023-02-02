/**
 * Import CSS
 */
import './editor.scss';

/**
 * External dependencies
 */
import Masonry from 'react-masonry-component';
import classnames from 'classnames';
import LazyLoad from 'react-lazyload';

/**
 * WordPress dependencies
 */
import {
	Fragment,
	RawHTML,
	Component,
} from '@wordpress/element';

import {
	__,
	sprintf,
} from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import {
	compose,
} from '@wordpress/compose';

import {
	decodeEntities,
} from '@wordpress/html-entities';

import {
	withSelect,
	withDispatch,
} from '@wordpress/data';

import {
	parse,
} from '@wordpress/blocks';

import {
	TabPanel,
	Spinner,
	SelectControl,
	Modal,
} from '@wordpress/components';

class TemplatesModal extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			loading: false,
			activeCategory: {},
			error: false,
		};

		this.getSelectedCategory = this.getSelectedCategory.bind( this );
		this.printCategorySelect = this.printCategorySelect.bind( this );
		this.getTemplates = this.getTemplates.bind( this );
	}

	getSelectedCategory( type ) {
		return this.state.activeCategory[ type ] || false;
	}

	printCategorySelect( type ) {
		const templates = this.getTemplates( type, '' );
		const categories = {};
		const selectData = [];

		templates.forEach( ( template ) => {
			if ( template.categories && template.categories.length ) {
				template.categories.forEach( ( catData ) => {
					if ( ! categories[ catData.slug ] ) {
						categories[ catData.slug ] = true;
						selectData.push( {
							value: catData.slug,
							label: catData.name,
						} );
					}
				} );
			}
		} );

		if ( selectData.length ) {
			selectData.unshift( {
				value: '',
				label: __( 'Select Category', 'generateblocks-pro' ),
			} );

			return (
				<SelectControl
					value={ this.getSelectedCategory( type ) }
					options={ selectData }
					onChange={ ( value ) => {
						this.setState( {
							activeCategory: {
								...this.state.activeCategory,
								...{
									[ type ]: value,
								},
							},
						} );
					} }
				/>
			);
		}

		return null;
	}

	getTemplates( type, categorySelected = null ) {
		const {
			templates = false,
		} = this.props;

		if ( ! templates ) {
			return templates;
		}

		const result = [];

		categorySelected = null === categorySelected ? this.getSelectedCategory( type ) : '';

		templates.forEach( ( template ) => {
			let allow = ! type;

			// type check.
			if ( ! allow && template.types ) {
				template.types.forEach( ( typeData ) => {
					if ( typeData.slug && type === typeData.slug ) {
						allow = true;
					}
				} );
			}

			// category check.
			if ( allow && categorySelected && template.categories ) {
				let categoryAllow = false;

				template.categories.forEach( ( catData ) => {
					if ( catData.slug && categorySelected === catData.slug ) {
						categoryAllow = true;
					}
				} );
				allow = categoryAllow;
			}

			if ( allow ) {
				result.push( template );
			}
		} );

		return result;
	}

	render() {
		const {
			insertTemplate,
			getTemplateData,
			onRequestClose,
			clientId,
			templates,
		} = this.props;

		let remoteError = '';

		if ( templates ) {
			templates.forEach( ( template ) => {
				if ( template.error ) {
					remoteError = template.error.toString();
				}
			} );
		}

		const allTemplates = this.getTemplates();
		const showLoadingSpinner = this.state.loading || ! allTemplates || ! allTemplates.length;
		const tabs = [];

		if ( generateBlocksPro.enableRemoteTemplates ) {
			tabs.push( {
				name: 'blocks',
				title: (
					<span>
						{ __( 'Blocks', 'generateblocks-pro' ) }
					</span>
				),
				className: 'generateblocks-control-tabs-tab',
			} );
		}

		if ( generateBlocksPro.enableLocalTemplates ) {
			tabs.push( {
				name: 'local',
				title: (
					<span>
						{ __( 'Local Patterns', 'generateblocks-pro' ) }
					</span>
				),
				className: 'generateblocks-control-tabs-tab',
			} );
		}

		return (
			<Modal
				title={ __( 'Patterns', 'generateblocks-pro' ) }
				className={ classnames(
					'generateblocks-plugin-templates-modal',
					'generateblocks-plugin-templates-modal-hide-header',
					showLoadingSpinner ? 'generateblocks-plugin-templates-modal-loading' : ''
				) }
				position="top"
				size="lg"
				onRequestClose={ () => {
					onRequestClose();
				} }
			>
				{ !! showLoadingSpinner &&
					<div className="generateblocks-plugin-templates-modal-loading-spinner"><Spinner /></div>
				}

				{ !! allTemplates && allTemplates.length > 0 &&
					<TabPanel
						className="generateblocks-control-tabs generateblocks-component-modal-tab-panel"
						tabs={ tabs }
					>
						{
							( tabData ) => {
								const tabType = tabData.name;
								const currentTemplates = this.getTemplates( tabType );
								const selectedCategory = this.getSelectedCategory( tabType );

								return (
									<Fragment>
										{ currentTemplates === false &&
											<div className="generateblocks-plugin-templates-spinner"><Spinner /></div>
										}

										{ !! currentTemplates && ! currentTemplates.length &&
											<div>
												{ 'local' === tabType ? (
													<Fragment>
														<p>{ __( 'No patterns found.', 'generateblocks-pro' ) }</p>
														<a className="components-button is-button is-primary" href={ generateBlocksPro.templatesURL } target="_blank" rel="noopener noreferrer">{ __( 'Add Template', 'generateblocks-pro' ) }</a>
													</Fragment>
												) : (
													<>
														<p>{ __( 'No patterns found.', 'generateblocks-pro' ) }</p>
														{ remoteError }
													</>
												) }
											</div>
										}

										{ !! currentTemplates && !! currentTemplates.length &&
											<Fragment key={ `${ tabType }-${ selectedCategory }` }>
												<div className="generateblocks-plugin-templates-categories-row">
													<div className="generateblocks-plugin-templates-categories-select">
														{ this.printCategorySelect( tabType ) }</div>
													<div className="generateblocks-plugin-templates-count">
														<RawHTML>
															{ sprintf(
																/* translators: Number of templates. */
																__( 'Patterns: %s', 'generateblocks-pro' ),
																`<strong>${ currentTemplates.length }</strong>` )
															}
														</RawHTML>
													</div>
												</div>
												{ this.state.error }
												<Masonry
													className="generateblocks-plugin-templates-list"
													elementType="ul"
													disableImagesLoaded={ false }
													updateOnEachImageLoad={ true }
													options={ {
														transitionDuration: 0,
													} }
												>
													{ currentTemplates.map( ( template ) => {
														const withThumb = !! template.thumbnail;
														const templateTitle = decodeEntities( template.title );

														let thumbAspectRatio = false;

														if ( template.thumbnail_height && template.thumbnail_width ) {
															thumbAspectRatio = template.thumbnail_height / template.thumbnail_width;
														}

														return (
															<li
																className={ classnames( 'generateblocks-plugin-templates-list-item', withThumb ? '' : 'generateblocks-plugin-templates-list-item-no-thumb' ) }
																key={ template.id }
															>
																<button
																	onClick={ () => {
																		this.setState( {
																			loading: true,
																		} );
																		getTemplateData( {
																			id: template.id,
																			type: tabType,
																		}, ( data ) => {
																			if ( data && data.success && data.response && data.response.content ) {
																				insertTemplate( data.response.content, clientId, ( error ) => {
																					if ( error ) {
																						this.setState( { error } );
																					} else {
																						onRequestClose();
																					}
																				} );
																			}
																			this.setState( {
																				loading: false,
																			} );
																		} );
																	} }
																>
																	{ withThumb &&
																		<div className="generateblocks-plugin-templates-list-item-image">
																			{ thumbAspectRatio &&
																				<div
																					className="generateblocks-plugin-templates-list-item-image-sizer"
																					style={ { paddingTop: `${ 100 * thumbAspectRatio }%` } }
																				/>
																			}

																			<LazyLoad overflow once>
																				<img
																					src={ template.thumbnail }
																					alt={ template.title }
																				/>
																			</LazyLoad>
																		</div>
																	}
																	<div className="generateblocks-plugin-templates-list-item-title">{ templateTitle }</div>
																</button>
															</li>
														);
													} ) }
												</Masonry>

												{ 'local' === tabType &&
													<Fragment>
														<a className="components-button is-button is-primary" href={ generateBlocksPro.templatesURL } target="_blank" rel="noopener noreferrer">{ __( 'Add Template', 'generateblocks-pro' ) }</a>
													</Fragment>
												}
											</Fragment>
										}
									</Fragment>
								);
							}
						}
					</TabPanel>
				}
			</Modal>
		);
	}
}

const TemplatesModalWithSelect = compose( [
	withDispatch( ( dispatch ) => {
		const {
			replaceBlocks,
		} = dispatch( 'core/block-editor' );

		return {
			insertTemplate( content, clientId, cb ) {
				const parsedBlocks = parse( content );

				if ( parsedBlocks.length ) {
					replaceBlocks( clientId, parsedBlocks );

					cb( false );
				}
			},
		};
	} ),
	withSelect( ( select ) => {
		const templates = select( 'generateblocks/templates' ).getTemplates();

		return {
			templates,
			getTemplateData( data, cb ) {
				let type = data.type;

				if ( 'local' !== type ) {
					type = 'remote';
				}

				apiFetch( {
					path: `/generateblocks-pro/v1/get_template_data/?id=${ data.id }&type=${ type }`,
					method: 'GET',
				} ).then( ( result ) => {
					cb( result );
				} );
			},
		};
	} ),
] )( TemplatesModal );

export { TemplatesModalWithSelect as TemplatesModal };
