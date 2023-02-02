/**
 * Internal dependencies
 */
import hasNumericValue from '../../utils/has-numeric-value';
import getIcon from '../../utils/get-icon';
import RangeControlInput from '../range-control';
import UnitPicker from '../unit-picker';
import ColorPicker from '../color-picker';

/**
 * WordPress dependencies
 */
import {
	__,
} from '@wordpress/i18n';

import {
	Component,
	Fragment,
} from '@wordpress/element';

import {
	Tooltip,
	Button,
	TextControl,
	SelectControl,
	BaseControl,
} from '@wordpress/components';

import {
	MediaUpload,
} from '@wordpress/block-editor';

import {
	applyFilters,
} from '@wordpress/hooks';

/**
 * Typography Component
 */
class BackgroundPanelItem extends Component {
	render() {
		const {
			attributes,
			setAttributes,
			effectOptions,
		} = this.props;

		const {
			advBackgrounds,
		} = attributes;

		const bgImageSizes = [];

		Object.keys( generateBlocksInfo.imageSizes ).forEach( ( size ) => {
			bgImageSizes.push( {
				label: generateBlocksInfo.imageSizes[ size ],
				value: generateBlocksInfo.imageSizes[ size ],
			} );
		} );

		return (
			<Fragment>
				{
					advBackgrounds.map( ( effect, index ) => {
						return <Fragment key={ index }>
							<div className="gblocks-advanced-dropdown-container">
								<div className="gblocks-adv-dropdown-header">
									<Fragment>
										{ ! advBackgrounds[ index ].type &&
											<SelectControl
												label={ __( 'Type', 'generateblocks-pro' ) }
												value={ advBackgrounds[ index ].type }
												options={ [
													{ label: __( 'Choose…', 'generateblocks-pro' ), value: '' },
													{ label: __( 'Image', 'generateblocks-pro' ), value: 'image' },
													{ label: __( 'Gradient', 'generateblocks-pro' ), value: 'gradient' },
												] }
												onChange={ ( value ) => {
													const effectValues = [ ...advBackgrounds ];

													if ( 'image' === value ) {
														effectValues[ index ] = {
															...effectValues[ index ],
															type: value,
															target: 'pseudo-element',
															url: '',
															id: '',
															imageSize: 'full',
															opacity: 1,
															size: 'cover',
															position: 'center center',
															repeat: 'no-repeat',
															attachment: 'scroll',
														};
													}

													if ( 'gradient' === value ) {
														if ( generateBlocksPro.hasRgbaSupport ) {
															effectValues[ index ] = {
																...effectValues[ index ],
																type: value,
																direction: 90,
																colorOne: 'rgba(255, 255, 255, 0.1)',
																colorTwo: 'rgba(0, 0, 0, 0.30)',
															};
														} else {
															effectValues[ index ] = {
																...effectValues[ index ],
																type: value,
																direction: 90,
																colorOne: '#ffffff',
																colorOneOpacity: 0.1,
																colorTwo: '#000000',
																colorTwoOpacity: 0.3,
															};
														}
													}

													setAttributes( {
														advBackgrounds: effectValues,
														innerZindex: 1,
													} );
												} }
											/>
										}

										{ 'gradient' === advBackgrounds[ index ].type &&
											<span className="gblocks-adv-dropdown-type-label">
												{ __( 'Gradient', 'generateblocks-pro' ) }
											</span>
										}

										{ 'image' === advBackgrounds[ index ].type &&
											<span className="gblocks-adv-dropdown-type-label">
												{ __( 'Image', 'generateblocks-pro' ) }
											</span>
										}

										<Tooltip text={ __( 'Delete Background', 'generateblocks-pro' ) }>
											<Button
												className="gblocks-delete-transform"
												onClick={ () => {
													// eslint-disable-next-line
													if ( window.confirm( __( 'This will permanently delete this background.', 'generateblocks-pro' ) ) ) {
														const effectValues = [ ...advBackgrounds ];

														effectValues.splice( index, 1 );
														setAttributes( { advBackgrounds: effectValues } );
													}
												} }
												icon={ getIcon( 'trash' ) }
											/>
										</Tooltip>
									</Fragment>
								</div>

								{ !! advBackgrounds[ index ].type &&
									<div className="gblocks-advanced-dropdown-options">
										<div className="gblocks-advanced-dropdown-option-device">
											<SelectControl
												label={ __( 'Device', 'generateblocks-pro' ) }
												value={ advBackgrounds[ index ].device }
												options={ [
													{ label: __( 'All', 'generateblocks-pro' ), value: 'all' },
													{ label: __( 'Desktop', 'generateblocks-pro' ), value: 'desktop' },
													{ label: __( 'Tablet', 'generateblocks-pro' ), value: 'tablet-only' },
													{ label: __( 'Tablet + Mobile', 'generateblocks-pro' ), value: 'tablet' },
													{ label: __( 'Mobile', 'generateblocks-pro' ), value: 'mobile' },
												] }
												onChange={ ( value ) => {
													const effectValues = [ ...advBackgrounds ];

													effectValues[ index ] = {
														...effectValues[ index ],
														device: value,
													};

													setAttributes( {
														advBackgrounds: effectValues,
													} );
												} }
											/>
										</div>

										<div className="gblocks-advanced-dropdown-option-state">
											<SelectControl
												label={ __( 'State', 'generateblocks-pro' ) }
												value={ advBackgrounds[ index ].state }
												options={ [
													{ label: __( 'Normal', 'generateblocks-pro' ), value: 'normal' },
													{ label: __( 'Hover', 'generateblocks-pro' ), value: 'hover' },
												] }
												onChange={ ( value ) => {
													const effectValues = [ ...advBackgrounds ];

													effectValues[ index ] = {
														...effectValues[ index ],
														state: value,
													};

													setAttributes( {
														advBackgrounds: effectValues,
													} );
												} }
											/>
										</div>

										{ effectOptions.length > 1 &&
											<Fragment>
												<div className="gblocks-advanced-dropdown-option-target">
													<SelectControl
														label={ __( 'Target', 'generateblocks-pro' ) }
														value={ advBackgrounds[ index ].target }
														options={ effectOptions }
														onChange={ ( value ) => {
															const effectValues = [ ...advBackgrounds ];

															effectValues[ index ] = {
																...effectValues[ index ],
																target: value,
															};

															setAttributes( {
																advBackgrounds: effectValues,
															} );
														} }
													/>
												</div>

												{ 'customSelector' === advBackgrounds[ index ].target &&
													<div className="gblocks-adv-dropdown-custom-selector">
														<TextControl
															label={ __( 'Custom Selector', 'generateblocks-pro' ) }
															type={ 'text' }
															placeholder=".gb-icon"
															value={ advBackgrounds[ index ].customSelector ? advBackgrounds[ index ].customSelector : '' }
															onChange={ ( value ) => {
																const effectValues = [ ...advBackgrounds ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	customSelector: value,
																};

																setAttributes( {
																	advBackgrounds: effectValues,
																} );
															} }
														/>
													</div>
												}
											</Fragment>
										}

										<div className="gblocks-adv-dropdown-separator"></div>

										{ 'gradient' === advBackgrounds[ index ].type &&
											<Fragment>
												<div className="gblocks-adv-dropdown-option">
													<RangeControlInput
														label={ __( 'Direction', 'generateblocks-pro' ) }
														value={ hasNumericValue( advBackgrounds[ index ].direction ) ? advBackgrounds[ index ].direction : 1 }
														onChange={ ( value ) => {
															const effectValues = [ ...advBackgrounds ];

															effectValues[ index ] = {
																...effectValues[ index ],
																direction: value,
															};

															setAttributes( {
																advBackgrounds: effectValues,
															} );
														} }
														rangeMin={ 0 }
														rangeMax={ 360 }
														step={ 1 }
													/>
												</div>

												<div className="gblocks-adv-dropdown-separator"></div>

												<div className="gblocks-adv-dropdown-option gblocks-adv-dropdown-option-no-grow">
													<BaseControl
														id="gblocks-box-shadow-color-one"
														className="gblocks-box-shadow-color"
														label={ __( 'Color', 'generateblocks-pro' ) }
													>
														<ColorPicker
															value={ advBackgrounds[ index ].colorOne }
															alpha={ true }
															valueOpacity={ hasNumericValue( advBackgrounds[ index ].colorOneOpacity ) ? advBackgrounds[ index ].colorOneOpacity : 1 }
															onChange={ ( value ) => {
																const effectValues = [ ...advBackgrounds ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	colorOne: value,
																};

																setAttributes( {
																	advBackgrounds: effectValues,
																} );
															} }
															onOpacityChange={ ( value ) => {
																const effectValues = [ ...advBackgrounds ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	colorOneOpacity: value,
																};

																setAttributes( {
																	advBackgrounds: effectValues,
																} );
															} }
														/>
													</BaseControl>
												</div>

												<div className="gblocks-adv-dropdown-option">
													<UnitPicker
														label={ __( 'Stop One', 'generateblocks-pro' ) }
														value={ '%' }
														units={ [ '%' ] }
														onClick={ () => {
															return false;
														} }
													/>

													<RangeControlInput
														value={ hasNumericValue( advBackgrounds[ index ].stopOne ) ? advBackgrounds[ index ].stopOne : '' }
														onChange={ ( value ) => {
															const effectValues = [ ...advBackgrounds ];

															effectValues[ index ] = {
																...effectValues[ index ],
																stopOne: value,
															};

															setAttributes( {
																advBackgrounds: effectValues,
															} );
														} }
														rangeMin={ 0 }
														rangeMax={ 100 }
														step={ 1 }
													/>
												</div>

												<div className="gblocks-adv-dropdown-option gblocks-adv-dropdown-option-no-grow">
													<BaseControl
														id="gblocks-box-shadow-color-two"
														className="gblocks-box-shadow-color"
														label={ __( 'Color', 'generateblocks-pro' ) }
													>
														<ColorPicker
															value={ advBackgrounds[ index ].colorTwo }
															alpha={ true }
															valueOpacity={ hasNumericValue( advBackgrounds[ index ].colorTwoOpacity ) ? advBackgrounds[ index ].colorTwoOpacity : 1 }
															onChange={ ( value ) => {
																const effectValues = [ ...advBackgrounds ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	colorTwo: value,
																};

																setAttributes( {
																	advBackgrounds: effectValues,
																} );
															} }
															onOpacityChange={ ( value ) => {
																const effectValues = [ ...advBackgrounds ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	colorTwoOpacity: value,
																};

																setAttributes( {
																	advBackgrounds: effectValues,
																} );
															} }
														/>
													</BaseControl>
												</div>

												<div className="gblocks-adv-dropdown-option">
													<UnitPicker
														label={ __( 'Stop Two', 'generateblocks-pro' ) }
														value={ '%' }
														units={ [ '%' ] }
														onClick={ () => {
															return false;
														} }
													/>

													<RangeControlInput
														value={ hasNumericValue( advBackgrounds[ index ].stopTwo ) ? advBackgrounds[ index ].stopTwo : '' }
														onChange={ ( value ) => {
															const effectValues = [ ...advBackgrounds ];

															effectValues[ index ] = {
																...effectValues[ index ],
																stopTwo: value,
															};

															setAttributes( {
																advBackgrounds: effectValues,
															} );
														} }
														rangeMin={ 0 }
														rangeMax={ 100 }
														step={ 1 }
													/>
												</div>
											</Fragment>
										}

										{ 'image' === advBackgrounds[ index ].type &&
											<Fragment>
												<div className="gblocks-adv-dropdown-option">
													<BaseControl
														id="gblocks-background-image-upload"
														label={ __( 'Image URL', 'generateblocks-pro' ) }
													>
														<div className="gblocks-bg-image-wrapper">
															{ advBackgrounds[ index ].url &&
																<img
																	src={ advBackgrounds[ index ].url }
																	width="30"
																	height="30"
																	alt={ __( 'Background image preview', 'generateblocks-pro' ) }
																/>
															}

															<TextControl
																type={ 'text' }
																value={ advBackgrounds[ index ].url || '' }
																onChange={ ( value ) => {
																	const effectValues = [ ...advBackgrounds ];

																	effectValues[ index ] = {
																		...effectValues[ index ],
																		url: value,
																	};

																	setAttributes( {
																		advBackgrounds: effectValues,
																	} );
																} }
															/>

															<div className="gblocks-background-image-action-buttons">
																<MediaUpload
																	title={ __( 'Set background image', 'generateblocks-pro' ) }
																	onSelect={ ( media ) => {
																		let size = advBackgrounds[ index ].imageSize;

																		if ( 'undefined' === typeof media.sizes[ size ] ) {
																			size = 'full';
																		}

																		const effectValues = [ ...advBackgrounds ];

																		effectValues[ index ] = {
																			...effectValues[ index ],
																			url: media.sizes[ size ].url,
																			id: media.id,
																		};

																		setAttributes( {
																			advBackgrounds: effectValues,
																		} );
																	} }
																	onClose={ () => {
																		document.querySelector( '.gblocks-bg-image-wrapper input' ).focus();
																		document.querySelector( '.gblocks-background-dropdown' ).style.zIndex = '';
																	} }
																	allowedTypes={ [ 'image' ] }
																	value={ advBackgrounds[ index ].id || '' }
																	modalClass="editor-gb-container-background__media-modal"
																	render={ ( { open } ) => (
																		<Tooltip text={ __( 'Open the Media Library', 'generateblocks-pro' ) }>
																			<Button
																				onClick={ () => {
																					document.querySelector( '.gblocks-background-dropdown' ).style.zIndex = 1;
																					open();
																				} }
																				className="is-secondary is-small"
																			>
																				{ __( 'Browse', 'generateblocks-pro' ) }
																			</Button>
																		</Tooltip>
																	) }
																/>

																{ applyFilters( 'generateblocks.editor.backgroundImageActions', '', this.props, this.state ) }
															</div>
														</div>
													</BaseControl>
												</div>

												{ 'undefined' !== typeof advBackgrounds[ index ].id && advBackgrounds[ index ].id &&
													<div className="gblocks-adv-dropdown-option">
														<SelectControl
															label={ __( 'Image Size', 'generateblocks-pro' ) }
															value={ advBackgrounds[ index ].imageSize }
															options={ bgImageSizes }
															onChange={ ( value ) => {
																const effectValues = [ ...advBackgrounds ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	imageSize: value,
																};

																setAttributes( {
																	advBackgrounds: effectValues,
																} );
															} }
														/>
													</div>
												}

												<div className="gblocks-adv-dropdown-separator"></div>

												<div className="gblocks-adv-dropdown-option">
													<TextControl
														label={ __( 'Size', 'generateblocks-pro' ) }
														value={ advBackgrounds[ index ].size }
														onChange={ ( value ) => {
															const effectValues = [ ...advBackgrounds ];

															effectValues[ index ] = {
																...effectValues[ index ],
																size: value,
															};

															setAttributes( {
																advBackgrounds: effectValues,
															} );
														} }
													/>
												</div>

												<div className="gblocks-adv-dropdown-option">
													<TextControl
														label={ __( 'Position', 'generateblocks-pro' ) }
														value={ advBackgrounds[ index ].position }
														onChange={ ( value ) => {
															const effectValues = [ ...advBackgrounds ];

															effectValues[ index ] = {
																...effectValues[ index ],
																position: value,
															};

															setAttributes( {
																advBackgrounds: effectValues,
															} );
														} }
													/>
												</div>

												<div className="gblocks-adv-dropdown-option">
													<SelectControl
														label={ __( 'Repeat', 'generateblocks-pro' ) }
														value={ advBackgrounds[ index ].repeat }
														options={ [
															{ label: 'no-repeat', value: 'no-repeat' },
															{ label: 'repeat', value: 'repeat' },
															{ label: 'repeat-x', value: 'repeat-x' },
															{ label: 'repeat-y', value: 'repeat-y' },
														] }
														onChange={ ( value ) => {
															const effectValues = [ ...advBackgrounds ];

															effectValues[ index ] = {
																...effectValues[ index ],
																repeat: value,
															};

															setAttributes( {
																advBackgrounds: effectValues,
															} );
														} }
													/>
												</div>

												<div className="gblocks-adv-dropdown-option">
													<SelectControl
														label={ __( 'Attachment', 'generateblocks-pro' ) }
														value={ advBackgrounds[ index ].attachment }
														options={ [
															{ label: 'scroll', value: '' },
															{ label: 'fixed', value: 'fixed' },
															{ label: 'local', value: 'local' },
														] }
														onChange={ ( value ) => {
															const effectValues = [ ...advBackgrounds ];

															effectValues[ index ] = {
																...effectValues[ index ],
																attachment: value,
															};

															setAttributes( {
																advBackgrounds: effectValues,
															} );
														} }
													/>
												</div>
											</Fragment>
										}
									</div>
								}
							</div>
						</Fragment>;
					} )
				}
			</Fragment>
		);
	}
}

export default BackgroundPanelItem;
