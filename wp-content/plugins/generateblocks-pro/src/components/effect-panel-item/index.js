/**
 * Internal dependencies
 */
import classnames from 'classnames';
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
	ToggleControl,
	BaseControl,
} from '@wordpress/components';

/**
 * Typography Component
 */
class EffectPanelItem extends Component {
	render() {
		const {
			attributes,
			setAttributes,
			effectType,
			effectName,
			effectOptions,
			effectLabel,
			onClose,
			useEffectName,
		} = this.props;

		const {
			transitions,
			bgOptions,
		} = attributes;

		const effects = attributes[ effectName ];

		function transitionExists( target, customSelector ) {
			return transitions.some( function( el ) {
				let hasTarget = false;

				if ( el.target === target ) {
					hasTarget = true;

					if ( 'undefined' !== typeof customSelector && '' !== customSelector ) {
						if ( el.customSelector !== customSelector ) {
							hasTarget = false;
						}
					}
				}

				return hasTarget;
			} );
		}

		return (
			<Fragment>
				{
					effects.map( ( effect, index ) => {
						return <Fragment key={ index }>
							<div className="gblocks-advanced-dropdown-container">
								<div className="gblocks-adv-dropdown-header">
									<span className="gblocks-adv-dropdown-type-label">
										{ effectLabel }
									</span>

									<Tooltip text={ __( 'Delete Effect', 'generateblocks-pro' ) }>
										<Button
											className="gblocks-delete-transform"
											onClick={ () => {
												// eslint-disable-next-line
												if ( window.confirm( __( 'This will permanently delete this transform.', 'generateblocks-pro' ) ) ) {
													const effectValues = [ ...effects ];

													effectValues.splice( index, 1 );
													setAttributes( { [ effectName ]: effectValues } );

													if ( effectValues.length === 0 ) {
														setAttributes( { [ useEffectName ]: false } );
														onClose();
													}
												}
											} }
											icon={ getIcon( 'trash' ) }
										/>
									</Tooltip>
								</div>

								<div className="gblocks-advanced-dropdown-options">
									{ 'transforms' === effectType &&
										<div className="gblocks-transform-type">
											<SelectControl
												label={ __( 'Type', 'generateblocks-pro' ) }
												value={ effects[ index ].type }
												options={ [
													{ label: __( 'Choose..', 'generateblocks-pro' ), value: '' },
													{ label: __( 'Translate', 'generateblocks-pro' ), value: 'translate' },
													{ label: __( 'Rotate', 'generateblocks-pro' ), value: 'rotate' },
													{ label: __( 'Skew', 'generateblocks-pro' ), value: 'skew' },
													{ label: __( 'Scale', 'generateblocks-pro' ), value: 'scale' },
												] }
												onChange={ ( value ) => {
													const effectValues = [ ...effects ];

													effectValues[ index ] = {
														...effectValues[ index ],
														type: value,
													};

													setAttributes( {
														[ effectName ]: effectValues,
													} );
												} }
											/>
										</div>
									}

									{ 'filters' === effectType &&
										<div className="gblocks-transform-type">
											<SelectControl
												label={ __( 'Type', 'generateblocks-pro' ) }
												value={ effects[ index ].type }
												options={ [
													{ label: __( 'Choose..', 'generateblocks-pro' ), value: '' },
													{ label: __( 'Blur', 'generateblocks-pro' ), value: 'blur' },
													{ label: __( 'Brightness', 'generateblocks-pro' ), value: 'brightness' },
													{ label: __( 'Contrast', 'generateblocks-pro' ), value: 'contrast' },
													{ label: __( 'Grayscale', 'generateblocks-pro' ), value: 'grayscale' },
													{ label: __( 'Hue-Rotate', 'generateblocks-pro' ), value: 'hue-rotate' },
													{ label: __( 'Invert', 'generateblocks-pro' ), value: 'invert' },
													{ label: __( 'Saturate', 'generateblocks-pro' ), value: 'saturate' },
													{ label: __( 'Sepia', 'generateblocks-pro' ), value: 'sepia' },
												] }
												onChange={ ( value ) => {
													const effectValues = [ ...effects ];

													effectValues[ index ] = {
														...effectValues[ index ],
														type: value,
													};

													setAttributes( {
														[ effectName ]: effectValues,
													} );
												} }
											/>
										</div>
									}

									<div className="gblocks-advanced-dropdown-option-device">
										<SelectControl
											label={ __( 'Device', 'generateblocks-pro' ) }
											value={ effects[ index ].device }
											options={ [
												{ label: __( 'All', 'generateblocks-pro' ), value: 'all' },
												{ label: __( 'Desktop', 'generateblocks-pro' ), value: 'desktop' },
												{ label: __( 'Tablet', 'generateblocks-pro' ), value: 'tablet-only' },
												{ label: __( 'Tablet + Mobile', 'generateblocks-pro' ), value: 'tablet' },
												{ label: __( 'Mobile', 'generateblocks-pro' ), value: 'mobile' },
											] }
											onChange={ ( value ) => {
												const effectValues = [ ...effects ];

												effectValues[ index ] = {
													...effectValues[ index ],
													device: value,
												};

												setAttributes( {
													[ effectName ]: effectValues,
												} );
											} }
										/>
									</div>

									<div className="gblocks-advanced-dropdown-option-state">
										<SelectControl
											label={ __( 'State', 'generateblocks-pro' ) }
											value={ effects[ index ].state }
											options={ [
												{ label: __( 'Normal', 'generateblocks-pro' ), value: 'normal' },
												{ label: __( 'Hover', 'generateblocks-pro' ), value: 'hover' },
											] }
											onChange={ ( value ) => {
												const effectValues = [ ...effects ];

												effectValues[ index ] = {
													...effectValues[ index ],
													state: value,
												};

												setAttributes( {
													[ effectName ]: effectValues,
												} );
											} }
										/>
									</div>

									{ effectOptions.length > 1 &&
										<Fragment>
											<div
												className={ classnames(
													'gblocks-advanced-dropdown-option-target',
													'backgroundImage' === effects[ index ].target ? 'gblocks-adv-dropdown-target-bg-image' : ''
												) }
											>
												<SelectControl
													label={ __( 'Target', 'generateblocks-pro' ) }
													value={ effects[ index ].target }
													options={ effectOptions }
													onChange={ ( value ) => {
														const effectValues = [ ...effects ];

														effectValues[ index ] = {
															...effectValues[ index ],
															target: value,
														};

														if ( 'backgroundImage' === value ) {
															setAttributes( {
																[ effectName ]: effectValues,
																bgOptions: {
																	...bgOptions,
																	selector: 'pseudo-element',
																},
															} );
														} else {
															setAttributes( {
																[ effectName ]: effectValues,
															} );
														}
													} }
												/>

												{ 'backgroundImage' === effects[ index ].target &&
													<div className="gblocks-adv-dropdown-bg-image-notice">
														<Tooltip
															text={ __( 'Your background image must be set to Pseudo Element for effects to work.', 'generateblocks-pro' ) }
														>
															{ getIcon( 'info' ) }
														</Tooltip>
													</div>
												}
											</div>

											{ 'customSelector' === effects[ index ].target &&
												<div className="gblocks-adv-dropdown-custom-selector">
													<TextControl
														label={ __( 'Custom Selector', 'generateblocks-pro' ) }
														type={ 'text' }
														placeholder=".gb-icon"
														value={ effects[ index ].customSelector ? effects[ index ].customSelector : '' }
														onChange={ ( value ) => {
															const effectValues = [ ...effects ];

															effectValues[ index ] = {
																...effectValues[ index ],
																customSelector: value,
															};

															setAttributes( {
																[ effectName ]: effectValues,
															} );
														} }
													/>
												</div>
											}
										</Fragment>
									}

									<div className="gblocks-adv-dropdown-separator"></div>

									{ 'opacity' === effectType &&
										<Fragment>
											<div className="gblocks-adv-dropdown-option">
												<RangeControlInput
													label={ __( 'Opacity', 'generateblocks-pro' ) }
													value={ hasNumericValue( effects[ index ].opacity ) ? effects[ index ].opacity : 1 }
													onChange={ ( value ) => {
														const effectValues = [ ...effects ];

														effectValues[ index ] = {
															...effectValues[ index ],
															opacity: value,
														};

														setAttributes( {
															[ effectName ]: effectValues,
														} );
													} }
													rangeMin={ 0 }
													rangeMax={ 1 }
													step={ .1 }
												/>
											</div>

											<div className="gblocks-adv-dropdown-option">
												<SelectControl
													label={ __( 'Mix Blend Mode', 'generateblocks-pro' ) }
													value={ effects[ index ].mixBlendMode }
													options={ [
														{ label: __( 'Choose…', 'generateblocks-pro' ), value: '' },
														{ label: __( 'Multiply', 'generateblocks-pro' ), value: 'multiply' },
														{ label: __( 'Screen', 'generateblocks-pro' ), value: 'screen' },
														{ label: __( 'Overlay', 'generateblocks-pro' ), value: 'overlay' },
														{ label: __( 'Darken', 'generateblocks-pro' ), value: 'darken' },
														{ label: __( 'Lighten', 'generateblocks-pro' ), value: 'lighten' },
														{ label: __( 'Color Dodge', 'generateblocks-pro' ), value: 'color-dodge' },
														{ label: __( 'Color Burn', 'generateblocks-pro' ), value: 'color-burn' },
														{ label: __( 'Hard Light', 'generateblocks-pro' ), value: 'hard-light' },
														{ label: __( 'Soft Light', 'generateblocks-pro' ), value: 'soft-light' },
														{ label: __( 'Difference', 'generateblocks-pro' ), value: 'difference' },
														{ label: __( 'Exclusion', 'generateblocks-pro' ), value: 'exclusion' },
														{ label: __( 'Hue', 'generateblocks-pro' ), value: 'hue' },
														{ label: __( 'Saturation', 'generateblocks-pro' ), value: 'saturation' },
														{ label: __( 'Color', 'generateblocks-pro' ), value: 'color' },
														{ label: __( 'Luminosity', 'generateblocks-pro' ), value: 'luminosity' },
													] }
													onChange={ ( value ) => {
														const effectValues = [ ...effects ];

														effectValues[ index ] = {
															...effectValues[ index ],
															mixBlendMode: value,
														};

														setAttributes( {
															[ effectName ]: effectValues,
														} );
													} }
												/>
											</div>
										</Fragment>
									}

									{ 'transition' === effectType &&
										<Fragment>
											<div className="gblocks-adv-dropdown-option">
												<TextControl
													label={ __( 'Timing Function', 'generateblocks-pro' ) }
													type={ 'text' }
													value={ effects[ index ].timingFunction || '' }
													onChange={ ( value ) => {
														const effectValues = [ ...effects ];

														effectValues[ index ] = {
															...effectValues[ index ],
															timingFunction: value,
														};

														setAttributes( {
															[ effectName ]: effectValues,
														} );
													} }
												/>
											</div>

											<div className="gblocks-adv-dropdown-option">
												<TextControl
													label={ __( 'CSS Property', 'generateblocks-pro' ) }
													type={ 'text' }
													value={ effects[ index ].property || '' }
													onChange={ ( value ) => {
														const effectValues = [ ...effects ];

														effectValues[ index ] = {
															...effectValues[ index ],
															property: value,
														};

														setAttributes( {
															[ effectName ]: effectValues,
														} );
													} }
												/>
											</div>

											<div className="gblocks-adv-dropdown-separator"></div>

											<div className="gblocks-adv-dropdown-option">
												<UnitPicker
													label={ __( 'Transition Duration', 'generateblocks-pro' ) }
													value={ 'sec' }
													units={ [ 'sec' ] }
													onClick={ () => {
														return false;
													} }
												/>

												<RangeControlInput
													value={ hasNumericValue( effects[ index ].duration ) ? effects[ index ].duration : '' }
													onChange={ ( value ) => {
														const effectValues = [ ...effects ];

														effectValues[ index ] = {
															...effectValues[ index ],
															duration: value,
														};

														setAttributes( {
															[ effectName ]: effectValues,
														} );
													} }
													inputMin={ 0 }
													inputMax={ 1 }
													rangeMin={ 0 }
													rangeMax={ 1 }
													step={ 0.1 }
												/>
											</div>

											<div className="gblocks-adv-dropdown-option">
												<UnitPicker
													label={ __( 'Delay', 'generateblocks-pro' ) }
													value={ 'sec' }
													units={ [ 'sec' ] }
													onClick={ () => {
														return false;
													} }
												/>

												<RangeControlInput
													value={ hasNumericValue( effects[ index ].delay ) ? effects[ index ].delay : '' }
													onChange={ ( value ) => {
														const effectValues = [ ...effects ];

														effectValues[ index ] = {
															...effectValues[ index ],
															delay: value,
														};

														setAttributes( {
															[ effectName ]: effectValues,
														} );
													} }
													inputMin={ 0 }
													inputMax={ 1 }
													rangeMin={ 0 }
													rangeMax={ 1 }
													step={ 0.1 }
												/>
											</div>
										</Fragment>
									}

									{ 'box-shadow' === effectType &&
										<Fragment>
											<div className="gblocks-adv-dropdown-option gblocks-adv-dropdown-option-no-grow">
												<BaseControl
													id="gblocks-box-shadow-inset"
													label={ __( 'Inset', 'generateblocks-pro' ) }
												>
													<ToggleControl
														checked={ !! effects[ index ].inset }
														onChange={ ( value ) => {
															const effectValues = [ ...effects ];

															effectValues[ index ] = {
																...effectValues[ index ],
																inset: value,
															};

															setAttributes( {
																[ effectName ]: effectValues,
															} );
														} }
													/>
												</BaseControl>
											</div>

											<div className="gblocks-adv-dropdown-option gblocks-adv-dropdown-option-no-grow">
												<BaseControl
													id="gblocks-box-shadow-color"
													label={ __( 'Color', 'generateblocks-pro' ) }
												>
													<ColorPicker
														value={ effects[ index ].color }
														alpha={ true }
														valueOpacity={ effects[ index ].colorOpacity }
														onChange={ ( value ) => {
															const effectValues = [ ...effects ];

															effectValues[ index ] = {
																...effectValues[ index ],
																color: value,
															};

															setAttributes( {
																[ effectName ]: effectValues,
															} );
														} }
														onOpacityChange={ ( value ) => {
															const effectValues = [ ...effects ];

															effectValues[ index ] = {
																...effectValues[ index ],
																colorOpacity: value,
															};

															setAttributes( {
																[ effectName ]: effectValues,
															} );
														} }
													/>
												</BaseControl>
											</div>

											<div className="gblocks-adv-dropdown-option">
												<UnitPicker
													label={ __( 'Horizontal Offset', 'generateblocks-pro' ) }
													value={ 'px' }
													units={ [ 'px' ] }
													onClick={ () => {
														return false;
													} }
												/>

												<RangeControlInput
													value={ hasNumericValue( effects[ index ].xOffset ) ? effects[ index ].xOffset : '' }
													onChange={ ( value ) => {
														const effectValues = [ ...effects ];

														effectValues[ index ] = {
															...effectValues[ index ],
															xOffset: value,
														};

														setAttributes( {
															[ effectName ]: effectValues,
														} );
													} }
													rangeMin={ -50 }
													rangeMax={ 50 }
													step={ 1 }
												/>
											</div>

											<div className="gblocks-adv-dropdown-option">
												<UnitPicker
													label={ __( 'Vertical Offset', 'generateblocks-pro' ) }
													value={ 'px' }
													units={ [ 'px' ] }
													onClick={ () => {
														return false;
													} }
												/>

												<RangeControlInput
													value={ hasNumericValue( effects[ index ].yOffset ) ? effects[ index ].yOffset : '' }
													onChange={ ( value ) => {
														const effectValues = [ ...effects ];

														effectValues[ index ] = {
															...effectValues[ index ],
															yOffset: value,
														};

														setAttributes( {
															[ effectName ]: effectValues,
														} );
													} }
													rangeMin={ -50 }
													rangeMax={ 50 }
													step={ 1 }
												/>
											</div>

											<div className="gblocks-adv-dropdown-separator"></div>

											<div className="gblocks-adv-dropdown-option">
												<UnitPicker
													label={ __( 'Blur', 'generateblocks-pro' ) }
													value={ 'px' }
													units={ [ 'px' ] }
													onClick={ () => {
														return false;
													} }
												/>

												<RangeControlInput
													value={ hasNumericValue( effects[ index ].blur ) ? effects[ index ].blur : '' }
													onChange={ ( value ) => {
														const effectValues = [ ...effects ];

														effectValues[ index ] = {
															...effectValues[ index ],
															blur: value,
														};

														setAttributes( {
															[ effectName ]: effectValues,
														} );
													} }
													inputMin={ 0 }
													rangeMin={ 0 }
													rangeMax={ 50 }
													step={ 1 }
												/>
											</div>

											<div className="gblocks-adv-dropdown-option">
												<UnitPicker
													label={ __( 'Spread', 'generateblocks-pro' ) }
													value={ 'px' }
													units={ [ 'px' ] }
													onClick={ () => {
														return false;
													} }
												/>

												<RangeControlInput
													value={ hasNumericValue( effects[ index ].spread ) ? effects[ index ].spread : '' }
													onChange={ ( value ) => {
														const effectValues = [ ...effects ];

														effectValues[ index ] = {
															...effectValues[ index ],
															spread: value,
														};

														setAttributes( {
															[ effectName ]: effectValues,
														} );
													} }
													rangeMin={ -50 }
													rangeMax={ 50 }
												/>
											</div>
										</Fragment>
									}

									{ 'text-shadow' === effectType &&
										<Fragment>
											<div className="gblocks-adv-dropdown-option gblocks-adv-dropdown-option-no-grow">
												<BaseControl
													id="gblocks-text-shadow-color"
													label={ __( 'Color', 'generateblocks-pro' ) }
												>
													<ColorPicker
														value={ effects[ index ].color }
														alpha={ true }
														valueOpacity={ effects[ index ].colorOpacity }
														onChange={ ( value ) => {
															const effectValues = [ ...effects ];

															effectValues[ index ] = {
																...effectValues[ index ],
																color: value,
															};

															setAttributes( {
																[ effectName ]: effectValues,
															} );
														} }
														onOpacityChange={ ( value ) => {
															const effectValues = [ ...effects ];

															effectValues[ index ] = {
																...effectValues[ index ],
																colorOpacity: value,
															};

															setAttributes( {
																[ effectName ]: effectValues,
															} );
														} }
													/>
												</BaseControl>
											</div>

											<div className="gblocks-adv-dropdown-option">
												<UnitPicker
													label={ __( 'Horizontal Offset', 'generateblocks-pro' ) }
													value={ 'px' }
													units={ [ 'px' ] }
													onClick={ () => {
														return false;
													} }
												/>

												<RangeControlInput
													value={ hasNumericValue( effects[ index ].xOffset ) ? effects[ index ].xOffset : '' }
													onChange={ ( value ) => {
														const effectValues = [ ...effects ];

														effectValues[ index ] = {
															...effectValues[ index ],
															xOffset: value,
														};

														setAttributes( {
															[ effectName ]: effectValues,
														} );
													} }
													rangeMin={ -50 }
													rangeMax={ 50 }
													step={ 1 }
												/>
											</div>

											<div className="gblocks-adv-dropdown-option">
												<UnitPicker
													label={ __( 'Vertical Offset', 'generateblocks-pro' ) }
													value={ 'px' }
													units={ [ 'px' ] }
													onClick={ () => {
														return false;
													} }
												/>

												<RangeControlInput
													value={ hasNumericValue( effects[ index ].yOffset ) ? effects[ index ].yOffset : '' }
													onChange={ ( value ) => {
														const effectValues = [ ...effects ];

														effectValues[ index ] = {
															...effectValues[ index ],
															yOffset: value,
														};

														setAttributes( {
															[ effectName ]: effectValues,
														} );
													} }
													rangeMin={ -50 }
													rangeMax={ 50 }
													step={ 1 }
												/>
											</div>

											<div className="gblocks-adv-dropdown-option">
												<UnitPicker
													label={ __( 'Blur', 'generateblocks-pro' ) }
													value={ 'px' }
													units={ [ 'px' ] }
													onClick={ () => {
														return false;
													} }
												/>

												<RangeControlInput
													value={ hasNumericValue( effects[ index ].blur ) ? effects[ index ].blur : '' }
													onChange={ ( value ) => {
														const effectValues = [ ...effects ];

														effectValues[ index ] = {
															...effectValues[ index ],
															blur: value,
														};

														setAttributes( {
															[ effectName ]: effectValues,
														} );
													} }
													inputMin={ 0 }
													rangeMin={ 0 }
													rangeMax={ 50 }
													step={ 1 }
												/>
											</div>
										</Fragment>
									}

									{ 'transforms' === effectType &&
										<Fragment>
											{ 'translate' === effects[ index ].type &&
												<Fragment>
													<div className="gblocks-adv-dropdown-option">
														<UnitPicker
															label={ __( 'Translate X', 'generateblocks-pro' ) }
															value={ 'px' }
															units={ [ 'px' ] }
															onClick={ () => {
																return false;
															} }
														/>

														<RangeControlInput
															value={ hasNumericValue( effects[ index ].translateX ) ? effects[ index ].translateX : '' }
															onChange={ ( value ) => {
																const effectValues = [ ...effects ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	translateX: value,
																};

																setAttributes( {
																	[ effectName ]: effectValues,
																} );
															} }
															rangeMin={ -50 }
															rangeMax={ 50 }
															step={ 1 }
														/>
													</div>

													<div className="gblocks-adv-dropdown-option">
														<UnitPicker
															label={ __( 'Translate Y', 'generateblocks-pro' ) }
															value={ 'px' }
															units={ [ 'px' ] }
															onClick={ () => {
																return false;
															} }
														/>

														<RangeControlInput
															value={ hasNumericValue( effects[ index ].translateY ) ? effects[ index ].translateY : '' }
															onChange={ ( value ) => {
																const effectValues = [ ...effects ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	translateY: value,
																};

																setAttributes( {
																	[ effectName ]: effectValues,
																} );
															} }
															rangeMin={ -50 }
															rangeMax={ 50 }
															step={ 1 }
														/>
													</div>
												</Fragment>
											}

											{ 'rotate' === effects[ index ].type &&
												<Fragment>
													<div className="gblocks-adv-dropdown-option">
														<UnitPicker
															label={ __( 'Rotate', 'generateblocks-pro' ) }
															value={ 'deg' }
															units={ [ 'deg' ] }
															onClick={ () => {
																return false;
															} }
														/>

														<RangeControlInput
															value={ hasNumericValue( effects[ index ].rotate ) ? effects[ index ].rotate : '' }
															onChange={ ( value ) => {
																const effectValues = [ ...effects ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	rotate: value,
																};

																setAttributes( {
																	[ effectName ]: effectValues,
																} );
															} }
															rangeMin={ 0 }
															rangeMax={ 360 }
															step={ 1 }
														/>
													</div>
												</Fragment>
											}

											{ 'skew' === effects[ index ].type &&
												<Fragment>
													<div className="gblocks-adv-dropdown-option">
														<UnitPicker
															label={ __( 'Skew X', 'generateblocks-pro' ) }
															value={ 'deg' }
															units={ [ 'deg' ] }
															onClick={ () => {
																return false;
															} }
														/>

														<RangeControlInput
															value={ hasNumericValue( effects[ index ].skewX ) ? effects[ index ].skewX : '' }
															onChange={ ( value ) => {
																const effectValues = [ ...effects ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	skewX: value,
																};

																setAttributes( {
																	[ effectName ]: effectValues,
																} );
															} }
															rangeMin={ 0 }
															rangeMax={ 360 }
															step={ 1 }
														/>
													</div>

													<div className="gblocks-adv-dropdown-option">
														<UnitPicker
															label={ __( 'Skew Y', 'generateblocks-pro' ) }
															value={ 'deg' }
															units={ [ 'deg' ] }
															onClick={ () => {
																return false;
															} }
														/>

														<RangeControlInput
															value={ hasNumericValue( effects[ index ].skewY ) ? effects[ index ].skewY : '' }
															onChange={ ( value ) => {
																const effectValues = [ ...effects ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	skewY: value,
																};

																setAttributes( {
																	[ effectName ]: effectValues,
																} );
															} }
															rangeMin={ 0 }
															rangeMax={ 360 }
															step={ 1 }
														/>
													</div>
												</Fragment>
											}

											{ 'scale' === effects[ index ].type &&
												<Fragment>
													<div className="gblocks-adv-dropdown-option">
														<RangeControlInput
															label={ __( 'Scale', 'generateblocks-pro' ) }
															value={ hasNumericValue( effects[ index ].scale ) ? effects[ index ].scale : '' }
															onChange={ ( value ) => {
																const effectValues = [ ...effects ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	scale: value,
																};

																setAttributes( {
																	[ effectName ]: effectValues,
																} );
															} }
															rangeMin={ 0 }
															rangeMax={ 2 }
															step={ .1 }
															initialPosition={ 1 }
															placeholder="1"
														/>
													</div>
												</Fragment>
											}
										</Fragment>
									}

									{ 'filters' === effectType &&
										<Fragment>
											{ 'blur' === effects[ index ].type &&
												<Fragment>
													<div className="gblocks-adv-dropdown-option">
														<UnitPicker
															label={ __( 'Blur', 'generateblocks-pro' ) }
															value={ 'px' }
															units={ [ 'px' ] }
															onClick={ () => {
																return false;
															} }
														/>

														<RangeControlInput
															value={ hasNumericValue( effects[ index ].blur ) ? effects[ index ].blur : '' }
															onChange={ ( value ) => {
																const effectValues = [ ...effects ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	blur: value,
																};

																setAttributes( {
																	[ effectName ]: effectValues,
																} );
															} }
															rangeMin={ 0 }
															rangeMax={ 50 }
															step={ 5 }
														/>
													</div>
												</Fragment>
											}

											{ 'brightness' === effects[ index ].type &&
												<Fragment>
													<div className="gblocks-adv-dropdown-option">
														<UnitPicker
															label={ __( 'Brightness', 'generateblocks-pro' ) }
															value={ '%' }
															units={ [ '%' ] }
															onClick={ () => {
																return false;
															} }
														/>

														<RangeControlInput
															value={ hasNumericValue( effects[ index ].brightness ) ? effects[ index ].brightness : '' }
															onChange={ ( value ) => {
																const effectValues = [ ...effects ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	brightness: value,
																};

																setAttributes( {
																	[ effectName ]: effectValues,
																} );
															} }
															rangeMin={ 0 }
															rangeMax={ 200 }
															step={ 5 }
															initialPosition={ 100 }
														/>
													</div>
												</Fragment>
											}

											{ 'contrast' === effects[ index ].type &&
												<Fragment>
													<div className="gblocks-adv-dropdown-option">
														<UnitPicker
															label={ __( 'Contrast', 'generateblocks-pro' ) }
															value={ '%' }
															units={ [ '%' ] }
															onClick={ () => {
																return false;
															} }
														/>

														<RangeControlInput
															value={ hasNumericValue( effects[ index ].contrast ) ? effects[ index ].contrast : '' }
															onChange={ ( value ) => {
																const effectValues = [ ...effects ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	contrast: value,
																};

																setAttributes( {
																	[ effectName ]: effectValues,
																} );
															} }
															rangeMin={ 0 }
															rangeMax={ 200 }
															step={ 5 }
															initialPosition={ 100 }
														/>
													</div>
												</Fragment>
											}

											{ 'grayscale' === effects[ index ].type &&
												<Fragment>
													<div className="gblocks-adv-dropdown-option">
														<UnitPicker
															label={ __( 'Grayscale', 'generateblocks-pro' ) }
															value={ '%' }
															units={ [ '%' ] }
															onClick={ () => {
																return false;
															} }
														/>

														<RangeControlInput
															value={ hasNumericValue( effects[ index ].grayscale ) ? effects[ index ].grayscale : '' }
															onChange={ ( value ) => {
																const effectValues = [ ...effects ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	grayscale: value,
																};

																setAttributes( {
																	[ effectName ]: effectValues,
																} );
															} }
															rangeMin={ 0 }
															rangeMax={ 100 }
															step={ 5 }
														/>
													</div>
												</Fragment>
											}

											{ 'hue-rotate' === effects[ index ].type &&
												<Fragment>
													<div className="gblocks-adv-dropdown-option">
														<UnitPicker
															label={ __( 'Hue-Rotate', 'generateblocks-pro' ) }
															value={ 'deg' }
															units={ [ 'deg' ] }
															onClick={ () => {
																return false;
															} }
														/>

														<RangeControlInput
															value={ hasNumericValue( effects[ index ].hueRotate ) ? effects[ index ].hueRotate : '' }
															onChange={ ( value ) => {
																const effectValues = [ ...effects ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	hueRotate: value,
																};

																setAttributes( {
																	[ effectName ]: effectValues,
																} );
															} }
															rangeMin={ 0 }
															rangeMax={ 360 }
															step={ 5 }
														/>
													</div>
												</Fragment>
											}

											{ 'invert' === effects[ index ].type &&
												<Fragment>
													<div className="gblocks-adv-dropdown-option">
														<UnitPicker
															label={ __( 'Invert', 'generateblocks-pro' ) }
															value={ '%' }
															units={ [ '%' ] }
															onClick={ () => {
																return false;
															} }
														/>

														<RangeControlInput
															value={ hasNumericValue( effects[ index ].invert ) ? effects[ index ].invert : '' }
															onChange={ ( value ) => {
																const effectValues = [ ...effects ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	invert: value,
																};

																setAttributes( {
																	[ effectName ]: effectValues,
																} );
															} }
															rangeMin={ 0 }
															rangeMax={ 100 }
															step={ 5 }
														/>
													</div>
												</Fragment>
											}

											{ 'saturate' === effects[ index ].type &&
												<Fragment>
													<div className="gblocks-adv-dropdown-option">
														<UnitPicker
															label={ __( 'Saturate', 'generateblocks-pro' ) }
															value={ '%' }
															units={ [ '%' ] }
															onClick={ () => {
																return false;
															} }
														/>

														<RangeControlInput
															value={ hasNumericValue( effects[ index ].saturate ) ? effects[ index ].saturate : '' }
															onChange={ ( value ) => {
																const effectValues = [ ...effects ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	saturate: value,
																};

																setAttributes( {
																	[ effectName ]: effectValues,
																} );
															} }
															rangeMin={ 0 }
															rangeMax={ 200 }
															step={ 5 }
															initialPosition={ 100 }
														/>
													</div>
												</Fragment>
											}

											{ 'sepia' === effects[ index ].type &&
												<Fragment>
													<div className="gblocks-adv-dropdown-option">
														<UnitPicker
															label={ __( 'Sepia', 'generateblocks-pro' ) }
															value={ '%' }
															units={ [ '%' ] }
															onClick={ () => {
																return false;
															} }
														/>

														<RangeControlInput
															value={ hasNumericValue( effects[ index ].sepia ) ? effects[ index ].sepia : '' }
															onChange={ ( value ) => {
																const effectValues = [ ...effects ];

																effectValues[ index ] = {
																	...effectValues[ index ],
																	sepia: value,
																};

																setAttributes( {
																	[ effectName ]: effectValues,
																} );
															} }
															rangeMin={ 0 }
															rangeMax={ 100 }
															step={ 5 }
														/>
													</div>
												</Fragment>
											}
										</Fragment>
									}
								</div>

								{ 'transition' !== effectType && ! transitionExists( effects[ index ].target, effects[ index ].customSelector ) &&
									<div className="gblocks-effects-auto-add-transition">
										<Tooltip
											text={ __( 'Automatically add a smooth transition to this effect.', 'generateblocks-pro' ) }
										>
											<Button
												isSecondary
												isSmall
												className="gblocks-add-transition"
												onClick={ () => {
													const effectValues = [ ...transitions ];

													// Add a base transition to the element if we aren't already planning to.
													if ( transitions.length < 1 && 'self' !== effects[ index ].target ) {
														effectValues.push( {
															state: 'normal',
															target: 'self',
															customSelector: '',
															timingFunction: 'ease',
															property: 'all',
															duration: 0.5,
															delay: '',
														} );
													}

													effectValues.push( {
														state: 'normal',
														target: effects[ index ].target,
														customSelector: effects[ index ].customSelector,
														timingFunction: 'ease',
														property: 'all',
														duration: 0.5,
														delay: '',
													} );

													setAttributes( {
														useTransition: true,
														transitions: effectValues,
													} );
												} }
											>
												{ __( 'Add Transition', 'generateblocks-pro' ) }
											</Button>
										</Tooltip>
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

export default EffectPanelItem;
