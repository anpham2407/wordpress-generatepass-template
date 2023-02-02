import sanitizeSVG from '../utils/sanitize-svg';
import getIcon from '../utils/get-icon';
import saveAs from 'file-saver';
import './editor.scss';

/**
 * WordPress dependencies
 */
import {
	__,
} from '@wordpress/i18n';

import {
	BaseControl,
	Button,
	PanelBody,
	PanelRow,
	Placeholder,
	Spinner,
	TextControl,
	Notice,
	Tooltip,
	TextareaControl,
} from '@wordpress/components';

import {
	render,
	Component,
	Fragment,
} from '@wordpress/element';

import apiFetch from '@wordpress/api-fetch';

class App extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isAPILoaded: false,
			isAPISaving: false,
			icons: generateBlocksProSettings.icons,
			showImportField: false,
		};
	}

	componentDidMount() {
		this.setState( {
			isAPILoaded: true,
		} );
	}

	updateSettings( e ) {
		this.setState( { isAPISaving: true } );
		const message = e.target.nextElementSibling;

		apiFetch( {
			path: '/generateblocks-pro/v1/icon-settings',
			method: 'POST',
			data: {
				settings: this.state.icons,
			},
		} ).then( ( result ) => {
			this.setState( { isAPISaving: false } );
			message.classList.add( 'gblocks-action-message--show' );
			message.textContent = result.response;

			if ( ! result.success || ! result.response ) {
				message.classList.add( 'gblocks-action-message--error' );
			} else {
				setTimeout( function() {
					message.classList.remove( 'gblocks-action-message--show' );
				}, 3000 );
			}
		} );
	}

	render() {
		if ( ! this.state.isAPILoaded ) {
			return (
				<Placeholder className="gblocks-settings-placeholder">
					<Spinner />
				</Placeholder>
			);
		}

		let frame = '';

		return (
			<Fragment>
				<div className="generateblocks-settings-main">
					<PanelBody
						title={ __( 'Icons' ) }
					>
						<div className="gblocks-dashboard-panel-row-wrapper">
							<PanelRow>
								<BaseControl
									id="gblocks-asset-library-control"
									className="gblocks-asset-library-control"
								>
									<Notice
										className="gblocks-assets-safe-svg-notice"
										isDismissible={ false }
										status={ 'info' }
									>
										{ __( 'Icons are static elements that are added to your content. Changes here will not affect your existing icons.', 'generateblocks-pro' ) }
									</Notice>

									<BaseControl className="gb-icon-chooser gb-shape-chooser">
										{
											this.state.icons.map( ( location, index ) => {
												return <Fragment key={ index }>
													<PanelBody
														title={ this.state.icons[ index ].group ? this.state.icons[ index ].group : __( 'Group', 'generateblocks-pro' ) }
														initialOpen={ false }
													>
														<TextControl
															className="gblocks-group-name"
															type="text"
															label={ __( 'Group Name', 'generateblocks-pro' ) }
															value={ this.state.icons[ index ].group }
															onChange={ ( value ) => {
																const assetValues = [ ...this.state.icons ];

																assetValues[ index ] = {
																	...assetValues[ index ],
																	group: value,
																};

																this.setState( {
																	icons: assetValues,
																} );
															} }
														/>

														<Button
															className="gblocks-delete-asset-group is-secondary is-small"
															onClick={ () => {
																// eslint-disable-next-line
																if ( window.confirm( __( 'This will permanently delete all icons in this group.', 'generateblocks-pro' ) ) ) {
																	const assetValues = [ ...this.state.icons ];

																	assetValues.splice( index, 1 );

																	this.setState( {
																		icons: assetValues,
																	} );
																}
															} }
														>
															{ __( 'Delete Group', 'generateblocks-pro' ) }
														</Button>

														{ 'undefined' !== typeof this.state.icons[ index ].icons && this.state.icons[ index ].icons.length > 0 &&
															<Button
																className="gblocks-export-asset-group is-secondary is-small"
																onClick={ () => {
																	apiFetch( {
																		path: '/generateblocks-pro/v1/export-asset-group',
																		method: 'POST',
																		data: {
																			assetType: 'icons',
																			groupName: this.state.icons[ index ].group,
																			assets: this.state.icons[ index ].icons,
																		},
																	} ).then( ( result ) => {
																		const fileName = 'group-' + this.state.icons[ index ].group + '.json';

																		const fileToSave = new Blob( [ JSON.stringify( result.response ) ], {
																			type: 'application/json',
																			name: fileName,
																		} );

																		saveAs( fileToSave, fileName );
																	} );
																} }
															>
																{ __( 'Export Group', 'generateblocks-pro' ) }
															</Button>
														}

														{ !! this.state.icons[ index ].group &&
															<BaseControl
																className="gblocks-asset-items"
															>
																{ this.state.icons[ index ].icons && this.state.icons[ index ].icons.map( ( icon, iconIndex ) => {
																	return <Fragment key={ iconIndex }>
																		<div className="gblocks-asset-item">
																			<div className="gblocks-asset-name-area">
																				<div className="gblocks-asset-name-upload">
																					<TextControl
																						type="text"
																						placeholder={ __( 'Name', 'generateblocks-pro' ) }
																						value={ this.state.icons[ index ].icons[ iconIndex ].name || '' }
																						onChange={ ( value ) => {
																							const assetValues = [ ...this.state.icons ];

																							assetValues[ index ].icons[ iconIndex ].name = value;

																							this.setState( {
																								icons: assetValues,
																							} );
																						} }
																					/>

																					{ generateBlocksProSettings.hasSVGSupport &&
																						<Fragment>
																							<Tooltip
																								text={ __( 'Upload an SVG file', 'generateblocks-pro' ) }
																							>
																								<Button
																									className="gblocks-upload-svg is-secondary"
																									onClick={ ( e ) => {
																										const container = e.target.closest( '.gblocks-asset-item' );
																										const assetValues = [ ...this.state.icons ];
																										const assetName = this.state.icons[ index ].icons[ iconIndex ].name;

																										frame = wp.media( {
																											title: __( 'Upload SVG', 'generateblocks-pro' ),
																											multiple: false,
																											library: { type: 'image/svg+xml' },
																											button: { text: __( 'Insert SVG', 'generateblocks-pro' ) },
																										} );

																										frame.on( 'select', () => {
																											const attachment = frame.state().get( 'selection' ).first().toJSON();

																											if ( ! assetName && attachment.name ) {
																												assetValues[ index ].icons[ iconIndex ].name = attachment.name;
																											}

																											container.classList.add( 'gblocks-asset-loading' );
																											container.querySelector( '.gblocks-asset-spinner' ).classList.add( 'gblocks-asset-show-spinner' );

																											apiFetch( {
																												path: '/generateblocks-pro/v1/inline-svg',
																												method: 'POST',
																												data: {
																													id: attachment.id,
																													url: attachment.url,
																												},
																											} ).then( ( result ) => {
																												let inlineSVG = result.response;

																												if ( ! inlineSVG.toLowerCase().includes( 'preserveaspectratio="none"' ) ) {
																													inlineSVG = inlineSVG.replace( '<svg', '<svg preserveAspectRatio="none"' );
																												}

																												assetValues[ index ].icons[ iconIndex ].icon = sanitizeSVG( inlineSVG );

																												this.setState( {
																													icons: assetValues,
																												} );

																												container.classList.remove( 'gblocks-asset-loading' );
																												container.querySelector( '.gblocks-asset-spinner' ).classList.remove( 'gblocks-asset-show-spinner' );
																											} );
																										} );

																										frame.open();
																									} }
																								>
																									{ __( 'Browse', 'generateblocks-pro' ) }
																								</Button>
																							</Tooltip>

																							<span className="gblocks-asset-spinner">
																								<Spinner />
																							</span>
																						</Fragment>
																					}
																				</div>

																				{ '' !== this.state.icons[ index ].icons[ iconIndex ].icon &&
																					<span
																						className="gblocks-asset-preview"
																						dangerouslySetInnerHTML={ { __html: sanitizeSVG( this.state.icons[ index ].icons[ iconIndex ].icon ) } }
																					/>
																				}
																			</div>

																			<TextareaControl
																				className="gblocks-asset-textarea-control"
																				label={ __( 'SVG HTML', 'generateblocks-pro' ) }
																				value={ this.state.icons[ index ].icons[ iconIndex ].icon || '' }
																				onChange={ ( value ) => {
																					const assetValues = [ ...this.state.icons ];

																					assetValues[ index ].icons[ iconIndex ].icon = sanitizeSVG( value );

																					this.setState( {
																						icons: assetValues,
																					} );
																				} }
																			/>

																			<Tooltip text={ __( 'Delete Icon', 'generateblocks-pro' ) }>
																				<Button
																					className="gblocks-delete-asset"
																					onClick={ () => {
																						// eslint-disable-next-line
																						if ( window.confirm( __( 'This will permanently delete this icon.', 'generateblocks-pro' ) ) ) {
																							const assetValues = [ ...this.state.icons ];

																							assetValues[ index ].icons.splice( iconIndex, 1 );

																							this.setState( {
																								icons: assetValues,
																							} );
																						}
																					} }
																					icon={ getIcon( 'x' ) }
																				/>
																			</Tooltip>
																		</div>
																	</Fragment>;
																} ) }

																<div className="gblocks-add-new-asset">
																	<Button
																		isSecondary
																		onClick={ () => {
																			const assetValues = [ ...this.state.icons ];

																			assetValues[ index ].icons.push( {
																				name: '',
																				icon: '',
																			} );

																			this.setState( {
																				icons: assetValues,
																			} );
																		} }
																	>
																		{ __( 'Add Icon', 'generateblocks-pro' ) }
																	</Button>
																</div>
															</BaseControl>
														}
													</PanelBody>
												</Fragment>;
											} )
										}
									</BaseControl>
								</BaseControl>
							</PanelRow>

							<PanelRow
								className="gblocks-asset-library-group-actions"
							>
								<div className="gblocks-add-new-asset-group">
									<Button
										isSecondary
										onClick={ () => {
											const assetValues = [ ...this.state.icons ];

											assetValues.push( {
												group: '',
												icons: [],
											} );

											this.setState( {
												icons: assetValues,
											} );
										} }
									>
										{ __( 'Add Group', 'generateblocks-pro' ) }
									</Button>
								</div>

								<div className="gblocks-import-asset-group">
									{ ! this.state.showImportField &&
										<Button
											isSecondary
											onClick={ () => this.setState( { showImportField: true } ) }
										>
											{ __( 'Import Group', 'generateblocks-pro' ) }
										</Button>
									}

									{ this.state.showImportField &&
										<input
											type="file"
											accept=".json"
											onChange={ ( event ) => {
												const message = event.target.nextElementSibling;
												const fileReader = new FileReader();

												fileReader.onloadend = () => {
													let content = fileReader.result;
													content = JSON.parse( content );

													if ( content && 'icons' === content.type ) {
														const assetValues = [ ...this.state.icons ];

														assetValues.push( {
															group: content.group,
															icons: content.assets,
														} );

														this.setState( {
															icons: assetValues,
														} );

														message.classList.add( 'gblocks-action-message--show' );
														message.textContent = __( 'Group imported.', 'generateblocks-pro' );

														setTimeout( function() {
															message.classList.remove( 'gblocks-action-message--show' );
														}, 3000 );
													}

													if ( ! content ) {
														message.classList.add( 'gblocks-action-message--show' );
														message.classList.add( 'gblocks-action-message--error' );
														message.textContent = __( 'File not valid.', 'generateblocks-pro' );

														setTimeout( function() {
															message.classList.remove( 'gblocks-action-message--show' );
															message.classList.remove( 'gblocks-action-message--error' );
														}, 3000 );
													}

													if ( 'icons' !== content.type ) {
														message.classList.add( 'gblocks-action-message--show' );
														message.classList.add( 'gblocks-action-message--error' );
														message.textContent = __( 'Wrong asset type.', 'generateblocks-pro' );

														setTimeout( function() {
															message.classList.remove( 'gblocks-action-message--show' );
															message.classList.remove( 'gblocks-action-message--error' );
														}, 3000 );
													}
												};

												fileReader.readAsText( event.target.files[ 0 ] );
												event.target.value = '';
												this.setState( { showImportField: false } );
											} }
										/>
									}

									<span className="gblocks-action-message"></span>
								</div>
							</PanelRow>

							<PanelRow
								className="gblocks-asset-library-actions"
							>
								<div className="gblocks-action-button">
									<Button
										isPrimary
										disabled={ this.state.isAPISaving }
										onClick={ ( e ) => this.updateSettings( e ) }
									>
										{ this.state.isAPISaving && <Spinner /> }
										{ ! this.state.isAPISaving && __( 'Save Icons' ) }
									</Button>

									<span className="gblocks-action-message"></span>
								</div>
							</PanelRow>
						</div>
					</PanelBody>
				</div>
			</Fragment>
		);
	}
}

window.addEventListener( 'DOMContentLoaded', () => {
	render(
		<App />,
		document.getElementById( 'gblocks-icon-library' )
	);
} );
