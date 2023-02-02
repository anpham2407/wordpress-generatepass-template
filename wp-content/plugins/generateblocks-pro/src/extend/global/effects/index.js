import getIcon from '../../../utils/get-icon';
import addToCSS from '../../../utils/add-to-css';
import hexToRGBA from '../../../utils/hex-to-rgba';
import valueWithUnit from '../../../utils/value-with-unit';
import hasNumericValue from '../../../utils/has-numeric-value';
import getTransformData from '../../../utils/get-transform-data';
import getCSSFilterData from '../../../utils/get-css-filter-data';
import getEffectSelector from '../../../utils/get-effect-selector';
import EffectPanelItem from '../../../components/effect-panel-item';

/**
 * WordPress Dependencies
 */
import {
	__,
	sprintf,
} from '@wordpress/i18n';

import {
	addFilter,
	currentFilter,
	applyFilters,
} from '@wordpress/hooks';

import {
	Fragment,
} from '@wordpress/element';

import {
	PanelBody,
	ToggleControl,
	Dropdown,
	Button,
} from '@wordpress/components';

const allowedBlocks = [ 'generateblocks/container', 'generateblocks/button', 'generateblocks/headline', 'generateblocks/image' ];

/**
 * Add custom attribute for mobile visibility.
 *
 * @param {Object} settings Settings for the block.
 * @return {Object} settings Modified settings.
 */
function addAttributes( settings ) {
	if ( ! allowedBlocks.includes( settings.name ) ) {
		return settings;
	}

	let blockName = 'container';

	if ( 'generateblocks/button' === settings.name ) {
		blockName = 'button';
	} else if ( 'generateblocks/headline' === settings.name ) {
		blockName = 'headline';
	} else if ( 'generateblocks/image' === settings.name ) {
		blockName = 'image';
	}

	if ( typeof settings.attributes !== 'undefined' ) {
		settings.attributes = Object.assign( settings.attributes, {
			useOpacity: {
				type: 'boolean',
				default: generateBlocksDefaults[ blockName ].useOpacity,
			},
			opacities: {
				type: 'array',
				default: [],
			},
			opacityDisableInEditor: {
				type: 'boolean',
				default: false,
			},
			useTransition: {
				type: 'boolean',
				default: generateBlocksDefaults[ blockName ].useTransition,
			},
			transitions: {
				type: 'array',
				default: [],
			},
			useBoxShadow: {
				type: 'boolean',
				default: generateBlocksDefaults[ blockName ].useBoxShadow,
			},
			boxShadows: {
				type: 'array',
				default: [],
			},
			useTransform: {
				type: 'boolean',
				default: generateBlocksDefaults[ blockName ].useTransform,
			},
			transformDisableInEditor: {
				type: 'boolean',
				default: false,
			},
			transforms: {
				type: 'array',
				default: [],
			},
			useTextShadow: {
				type: 'boolean',
				default: generateBlocksDefaults[ blockName ].useTextShadow,
			},
			textShadows: {
				type: 'array',
				default: [],
			},
			useFilter: {
				type: 'boolean',
				default: generateBlocksDefaults[ blockName ].useFilter,
			},
			filters: {
				type: 'array',
				default: [],
			},
		} );
	}

	return settings;
}

function addControls( output, data ) {
	const {
		attributes,
		setAttributes,
		name,
	} = data.props;

	const {
		useOpacity,
		opacities,
		opacityDisableInEditor,
		useTransition,
		transitions,
		useBoxShadow,
		boxShadows,
		useTextShadow,
		textShadows,
		useTransform,
		transformDisableInEditor,
		transforms,
		useFilter,
		filters,
	} = attributes;

	const targetOptions = [ {
		label: __( 'Self', 'generateblocks-pro' ),
		value: 'self',
	} ];

	if ( 'generateblocks/container' === name ) {
		targetOptions.push( {
			label: __( 'Inner Container', 'generateblocks-pro' ),
			value: 'innerContainer',
		} );

		targetOptions.push( {
			label: __( 'Background Image', 'generateblocks-pro' ),
			value: 'backgroundImage',
		} );
	}

	targetOptions.push( {
		label: __( 'Custom Selector', 'generateblocks-pro' ),
		value: 'customSelector',
	} );

	if ( 'generateblocks/button' === name || 'generateblocks/headline' === name ) {
		targetOptions.push( {
			label: __( 'Icon', 'generateblocks-pro' ),
			value: 'icon',
		} );
	}

	return (
		<Fragment>
			<Fragment>
				<PanelBody
					title={ __( 'Effects', 'generateblocks-pro' ) }
					initialOpen={ false }
					icon={ getIcon( 'effects' ) }
					className={ 'gblocks-panel-label' }
				>
					<div className="gblocks-advanced-dropdown-item">
						<ToggleControl
							label={
								opacities.length > 0 ? (
									/* translators: Number of transforms. */
									sprintf( __( 'Opacity & Blend (%s)', 'generateblocks-pro' ), opacities.length )
								) : (
									__( 'Opacity & Blend', 'generateblocks-pro' )
								)
							}
							checked={ !! useOpacity }
							onChange={ ( value ) => {
								setAttributes( {
									useOpacity: value,
								} );
							} }
						/>
						<Dropdown
							position="top left"
							focusOnMount={ 'container' }
							contentClassName="gblocks-advanced-dropdown"
							renderToggle={ ( { isOpen, onToggle } ) => (
								<Button
									isSecondary={ isOpen ? undefined : true }
									isPrimary={ isOpen ? true : undefined }
									icon={ isOpen ? getIcon( 'x' ) : getIcon( 'wrench' ) }
									onClick={ onToggle }
									aria-expanded={ isOpen }
								/>
							) }
							renderContent={ ( { onClose } ) => (
								<div>
									<Fragment>
										<EffectPanelItem { ...data.props }
											effectLabel={ __( 'Opacity', 'generateblocks-pro' ) }
											effectType="opacity"
											effectName="opacities"
											useEffectName="useOpacity"
											effectOptions={ targetOptions }
											onClose={ onClose }
										/>

										<div className="gblocks-advanced-dropdown-actions">
											<Button
												isSecondary
												onClick={ () => {
													if ( ! useOpacity && opacities.length < 1 ) {
														setAttributes( { useOpacity: true } );
													}

													const effectValues = [ ...opacities ];

													effectValues.push( {
														state: 'normal',
														target: 'self',
														customSelector: '',
														opacity: 1,
													} );

													setAttributes( { opacities: effectValues } );
												} }
											>
												{ __( 'Add Effect', 'generateblocks-pro' ) }
											</Button>

											<Button
												isPrimary
												onClick={ onClose }
											>
												{ __( 'Close', 'generateblocks-pro' ) }
											</Button>

											<ToggleControl
												className="gblocks-disable-in-editor"
												label={ __( 'Disable in editor', 'generateblocks-pro' ) }
												help={ __( 'Disable these effects in the editor when this block is selected.', 'generateblocks-pro' ) }
												checked={ !! opacityDisableInEditor }
												onChange={ ( value ) => {
													setAttributes( {
														opacityDisableInEditor: value,
													} );
												} }
											/>
										</div>
									</Fragment>
								</div>
							) }
						/>
					</div>

					<div className="gblocks-advanced-dropdown-item">
						<ToggleControl
							label={
								transitions.length > 0 ? (
									/* translators: Number of transforms. */
									sprintf( __( 'Transition (%s)', 'generateblocks-pro' ), transitions.length )
								) : (
									__( 'Transition', 'generateblocks-pro' )
								)
							}
							checked={ !! useTransition }
							onChange={ ( value ) => {
								const effectValues = [ ...transitions ];

								if ( transitions.length < 1 && value ) {
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

								setAttributes( {
									useTransition: value,
									transitions: effectValues,
								} );
							} }
						/>
						<Dropdown
							position="top left"
							focusOnMount={ 'container' }
							contentClassName="gblocks-advanced-dropdown gblocks-transition-dropdown"
							renderToggle={ ( { isOpen, onToggle } ) => (
								<Button
									isSecondary={ isOpen ? undefined : true }
									isPrimary={ isOpen ? true : undefined }
									icon={ isOpen ? getIcon( 'x' ) : getIcon( 'wrench' ) }
									onClick={ onToggle }
									aria-expanded={ isOpen }
								/>
							) }
							renderContent={ ( { onClose } ) => (
								<div>
									<Fragment>
										<EffectPanelItem { ...data.props }
											effectLabel={ __( 'Transition', 'generateblocks-pro' ) }
											effectType="transition"
											effectName="transitions"
											useEffectName="useTransition"
											effectOptions={ targetOptions }
											onClose={ onClose }
										/>

										<div className="gblocks-advanced-dropdown-actions">
											<Button
												isSecondary
												onClick={ () => {
													if ( ! useTransition && transitions.length < 1 ) {
														setAttributes( { useTransition: true } );
													}

													const effectValues = [ ...transitions ];

													effectValues.push( {
														state: 'normal',
														target: 'self',
														customSelector: '',
														timingFunction: 'ease',
														property: 'all',
														duration: 0.5,
														delay: '',
													} );

													setAttributes( { transitions: effectValues } );
												} }
											>
												{ __( 'Add Effect', 'generateblocks-pro' ) }
											</Button>

											<Button
												isPrimary
												onClick={ onClose }
											>
												{ __( 'Close', 'generateblocks-pro' ) }
											</Button>
										</div>
									</Fragment>
								</div>
							) }
						/>
					</div>

					<div className="gblocks-advanced-dropdown-item">
						<ToggleControl
							label={
								boxShadows.length > 0 ? (
									/* translators: Number of transforms. */
									sprintf( __( 'Box Shadow (%s)', 'generateblocks-pro' ), boxShadows.length )
								) : (
									__( 'Box Shadow', 'generateblocks-pro' )
								)
							}
							checked={ !! useBoxShadow }
							onChange={ ( value ) => {
								const effectValues = [ ...boxShadows ];

								if ( boxShadows.length < 1 && value ) {
									effectValues.push( {
										state: 'normal',
										target: 'self',
										customSelector: '',
										inset: false,
										color: generateBlocksPro.hasRgbaSupport ? 'rgba(0,0,0,0.1)' : '#000000',
										colorOpacity: generateBlocksPro.hasRgbaSupport ? undefined : 0.1,
										xOffset: 5,
										yOffset: 5,
										blur: 10,
										spread: '',
									} );
								}

								setAttributes( {
									useBoxShadow: value,
									boxShadows: effectValues,
								} );
							} }
						/>
						<Dropdown
							position="top left"
							focusOnMount={ 'container' }
							contentClassName="gblocks-advanced-dropdown gblocks-box-shadow-dropdown"
							renderToggle={ ( { isOpen, onToggle } ) => (
								<Button
									isSecondary={ isOpen ? undefined : true }
									isPrimary={ isOpen ? true : undefined }
									icon={ isOpen ? getIcon( 'x' ) : getIcon( 'wrench' ) }
									onClick={ onToggle }
									aria-expanded={ isOpen }
								/>
							) }
							renderContent={ ( { onClose } ) => (
								<div>
									<Fragment>
										<EffectPanelItem { ...data.props }
											effectLabel={ __( 'Box Shadow', 'generateblocks-pro' ) }
											effectType="box-shadow"
											effectName="boxShadows"
											useEffectName="useBoxShadow"
											effectOptions={ targetOptions }
											onClose={ onClose }
										/>

										<div className="gblocks-advanced-dropdown-actions">
											<Button
												isSecondary
												onClick={ () => {
													if ( ! useBoxShadow && boxShadows.length < 1 ) {
														setAttributes( { useBoxShadow: true } );
													}

													const effectValues = [ ...boxShadows ];

													effectValues.push( {
														state: 'normal',
														target: 'self',
														customSelector: '',
														inset: false,
														color: generateBlocksPro.hasRgbaSupport ? 'rgba(0,0,0,0.1)' : '#000000',
														colorOpacity: generateBlocksPro.hasRgbaSupport ? undefined : 0.1,
														xOffset: 5,
														yOffset: 5,
														blur: 10,
														spread: '',
													} );

													setAttributes( { boxShadows: effectValues } );
												} }
											>
												{ __( 'Add Effect', 'generateblocks-pro' ) }
											</Button>

											<Button
												isPrimary
												onClick={ onClose }
											>
												{ __( 'Close', 'generateblocks-pro' ) }
											</Button>
										</div>
									</Fragment>
								</div>
							) }
						/>
					</div>

					{ 'generateblocks/image' !== name &&
						<div className="gblocks-advanced-dropdown-item">
							<ToggleControl
								label={
									textShadows.length > 0 ? (
										/* translators: Number of transforms. */
										sprintf( __( 'Text Shadow (%s)', 'generateblocks-pro' ), textShadows.length )
									) : (
										__( 'Text Shadow', 'generateblocks-pro' )
									)
								}
								checked={ !! useTextShadow }
								onChange={ ( value ) => {
									const effectValues = [ ...textShadows ];

									if ( textShadows.length < 1 && value ) {
										effectValues.push( {
											state: 'normal',
											target: 'self',
											customSelector: '',
											color: generateBlocksPro.hasRgbaSupport ? 'rgba(0,0,0,0.5)' : '#000000',
											colorOpacity: generateBlocksPro.hasRgbaSupport ? undefined : 0.5,
											xOffset: 5,
											yOffset: 5,
											blur: 10,
										} );
									}

									setAttributes( {
										useTextShadow: value,
										textShadows: effectValues,
									} );
								} }
							/>
							<Dropdown
								position="top left"
								focusOnMount={ 'container' }
								contentClassName="gblocks-advanced-dropdown gblocks-text-shadow-dropdown"
								renderToggle={ ( { isOpen, onToggle } ) => (
									<Button
										isSecondary={ isOpen ? undefined : true }
										isPrimary={ isOpen ? true : undefined }
										icon={ isOpen ? getIcon( 'x' ) : getIcon( 'wrench' ) }
										onClick={ onToggle }
										aria-expanded={ isOpen }
									/>
								) }
								renderContent={ ( { onClose } ) => (
									<div>
										<Fragment>
											<EffectPanelItem { ...data.props }
												effectLabel={ __( 'Text Shadow', 'generateblocks-pro' ) }
												effectType="text-shadow"
												effectName="textShadows"
												useEffectName="useTextShadow"
												effectOptions={ targetOptions }
												onClose={ onClose }
											/>

											<div className="gblocks-advanced-dropdown-actions">
												<Button
													isSecondary
													onClick={ () => {
														if ( ! useTextShadow && textShadows.length < 1 ) {
															setAttributes( { useTextShadow: true } );
														}

														const effectValues = [ ...textShadows ];

														effectValues.push( {
															state: 'normal',
															target: 'self',
															customSelector: '',
															color: generateBlocksPro.hasRgbaSupport ? 'rgba(0,0,0,0.5)' : '#000000',
															colorOpacity: generateBlocksPro.hasRgbaSupport ? undefined : 0.5,
															xOffset: 5,
															yOffset: 5,
															blur: 10,
														} );

														setAttributes( { textShadows: effectValues } );
													} }
												>
													{ __( 'Add Effect', 'generateblocks-pro' ) }
												</Button>

												<Button
													isPrimary
													onClick={ onClose }
												>
													{ __( 'Close', 'generateblocks-pro' ) }
												</Button>
											</div>
										</Fragment>
									</div>
								) }
							/>
						</div>
					}

					<div className="gblocks-advanced-dropdown-item">
						<ToggleControl
							label={
								transforms.length > 0 ? (
									/* translators: Number of transforms. */
									sprintf( __( 'Transform (%s)', 'generateblocks-pro' ), transforms.length )
								) : (
									__( 'Transform', 'generateblocks-pro' )
								)
							}
							checked={ !! useTransform }
							onChange={ ( value ) => {
								setAttributes( {
									useTransform: value,
								} );
							} }
						/>
						<Dropdown
							position="top left"
							focusOnMount={ 'container' }
							contentClassName="gblocks-advanced-dropdown"
							renderToggle={ ( { isOpen, onToggle } ) => (
								<Button
									isSecondary={ isOpen ? undefined : true }
									isPrimary={ isOpen ? true : undefined }
									icon={ isOpen ? getIcon( 'x' ) : getIcon( 'wrench' ) }
									onClick={ onToggle }
									aria-expanded={ isOpen }
								/>
							) }
							renderContent={ ( { onClose } ) => (
								<div>
									<Fragment>
										<EffectPanelItem { ...data.props }
											effectLabel={ __( 'Transform', 'generateblocks-pro' ) }
											effectType="transforms"
											effectName="transforms"
											useEffectName="useTransform"
											effectOptions={ targetOptions }
											onClose={ onClose }
										/>

										<div className="gblocks-advanced-dropdown-actions">
											<Button
												isSecondary
												onClick={ () => {
													if ( ! useTransform && transforms.length < 1 ) {
														setAttributes( { useTransform: true } );
													}

													const transformValues = [ ...transforms ];

													transformValues.push( {
														type: '',
														state: 'normal',
														target: 'self',
													} );

													setAttributes( { transforms: transformValues } );
												} }
											>
												{ __( 'Add Transform', 'generateblocks-pro' ) }
											</Button>

											<Button
												isPrimary
												onClick={ onClose }
											>
												{ __( 'Close', 'generateblocks-pro' ) }
											</Button>

											<ToggleControl
												className="gblocks-disable-in-editor"
												label={ __( 'Disable in editor', 'generateblocks-pro' ) }
												help={ __( 'Disable transforms in the editor when this block is selected.', 'generateblocks-pro' ) }
												checked={ !! transformDisableInEditor }
												onChange={ ( value ) => {
													setAttributes( {
														transformDisableInEditor: value,
													} );
												} }
											/>
										</div>
									</Fragment>
								</div>
							) }
						/>
					</div>

					<div className="gblocks-advanced-dropdown-item">
						<ToggleControl
							label={
								filters.length > 0 ? (
									/* translators: Number of transforms. */
									sprintf( __( 'Filter (%s)', 'generateblocks-pro' ), filters.length )
								) : (
									__( 'Filter', 'generateblocks-pro' )
								)
							}
							checked={ !! useFilter }
							onChange={ ( value ) => {
								setAttributes( {
									useFilter: value,
								} );
							} }
						/>
						<Dropdown
							position="top left"
							focusOnMount={ 'container' }
							contentClassName="gblocks-advanced-dropdown"
							renderToggle={ ( { isOpen, onToggle } ) => (
								<Button
									isSecondary={ isOpen ? undefined : true }
									isPrimary={ isOpen ? true : undefined }
									icon={ isOpen ? getIcon( 'x' ) : getIcon( 'wrench' ) }
									onClick={ onToggle }
									aria-expanded={ isOpen }
								/>
							) }
							renderContent={ ( { onClose } ) => (
								<div>
									<Fragment>
										<EffectPanelItem { ...data.props }
											effectLabel={ __( 'Filter', 'generateblocks-pro' ) }
											effectType="filters"
											effectName="filters"
											useEffectName="useFilter"
											effectOptions={ targetOptions }
											onClose={ onClose }
										/>

										<div className="gblocks-advanced-dropdown-actions">
											<Button
												isSecondary
												onClick={ () => {
													if ( ! useFilter && filters.length < 1 ) {
														setAttributes( { useTransform: true } );
													}

													const filterValues = [ ...filters ];

													filterValues.push( {
														type: '',
														state: 'normal',
														target: 'self',
													} );

													setAttributes( { filters: filterValues } );
												} }
											>
												{ __( 'Add Filter', 'generateblocks-pro' ) }
											</Button>

											<Button
												isPrimary
												onClick={ onClose }
											>
												{ __( 'Close', 'generateblocks-pro' ) }
											</Button>
										</div>
									</Fragment>
								</div>
							) }
						/>
					</div>
				</PanelBody>
			</Fragment>

			<Fragment>
				{ output }
			</Fragment>
		</Fragment>
	);
}

function addCSS( css, props, name ) {
	const allowedAreas = [ 'container', 'button', 'headline', 'image' ];

	if ( ! allowedAreas.includes( name ) ) {
		return css;
	}

	const attributes = applyFilters( 'generateblocks.editor.cssAttrs', props.attributes, props );

	const {
		uniqueId,
		useOpacity,
		opacities,
		opacityDisableInEditor,
		useTransition,
		transitions,
		useBoxShadow,
		boxShadows,
		useTransform,
		transformDisableInEditor,
		useTextShadow,
		textShadows,
		useFilter,
	} = attributes;

	if ( 'container' === name || 'button' === name || 'headline' === name || 'image' === name ) {
		let selector = '.editor-styles-wrapper .gb-container-' + uniqueId;

		if ( 'button' === name ) {
			selector = '.editor-styles-wrapper .gb-button-wrapper .gb-button-' + uniqueId;
		}

		if ( 'headline' === name ) {
			selector = '.editor-styles-wrapper .gb-headline-' + uniqueId;
		}

		if ( 'image' === name ) {
			selector = '.editor-styles-wrapper .gb-image-' + uniqueId;
		}

		if ( useBoxShadow ) {
			const boxShadowData = {};

			if ( boxShadows ) {
				Object.keys( boxShadows ).forEach( function( key ) {
					const selectorData = getEffectSelector( boxShadows, attributes, selector, key );

					const boxShadowValue = sprintf(
						'%1$s %2$s %3$s %4$s %5$s %6$s',
						boxShadows[ key ].inset ? 'inset' : '',
						boxShadows[ key ].xOffset ? boxShadows[ key ].xOffset + 'px' : 0,
						boxShadows[ key ].yOffset ? boxShadows[ key ].yOffset + 'px' : 0,
						boxShadows[ key ].blur ? boxShadows[ key ].blur + 'px' : 0,
						boxShadows[ key ].spread ? boxShadows[ key ].spread + 'px' : 0,
						hexToRGBA( boxShadows[ key ].color, boxShadows[ key ].colorOpacity ),
					);

					if ( 'undefined' === typeof boxShadowData[ selectorData.element ] ) {
						boxShadowData[ selectorData.element ] = {
							selector: selectorData.effectSelector,
							boxShadow: boxShadowValue,
							state: boxShadows[ key ].state,
							device: boxShadows[ key ].device,
						};
					}

					Object.keys( boxShadowData ).forEach( function( target ) {
						const data = boxShadowData[ target ];

						if ( 'undefined' !== typeof data.device ) {
							if ( 'desktop' === data.device && 'generateblocks.editor.desktopCSS' !== currentFilter() ) {
								return;
							}

							if ( 'tablet-only' === data.device && 'generateblocks.editor.tabletOnlyCSS' !== currentFilter() ) {
								return;
							}

							if ( 'tablet' === data.device && 'generateblocks.editor.tabletCSS' !== currentFilter() ) {
								return;
							}

							if ( 'mobile' === data.device && 'generateblocks.editor.mobileCSS' !== currentFilter() ) {
								return;
							}
						}

						if ( 'undefined' !== typeof data.boxShadow ) {
							addToCSS( css, data.selector, {
								'box-shadow': data.boxShadow,
							} );
						}
					} );
				} );
			}
		}

		if ( useOpacity ) {
			const opacityData = {};

			if ( opacities ) {
				Object.keys( opacities ).forEach( function( key ) {
					const selectorData = getEffectSelector( opacities, attributes, selector, key );

					if ( 'undefined' === typeof opacityData[ selectorData.element ] ) {
						opacityData[ selectorData.element ] = {
							selector: selectorData.effectSelector,
							opacity: opacities[ key ].opacity,
							mixBlendMode: opacities[ key ].mixBlendMode,
							state: opacities[ key ].state,
							device: opacities[ key ].device,
						};
					}

					Object.keys( opacityData ).forEach( function( target ) {
						const data = opacityData[ target ];

						let opacitySelector = data.selector;

						let blockNotSelected = '.wp-block:not(.is-selected):not(.has-child-selected)';

						// GB < 1.5.0 had the .wp-block selector as a parent to the block itself.
						// hasColorGroups is only true in GB 1.5.0.
						if ( ! generateBlocksPro.hasColorGroups ) {
							blockNotSelected += ' > ';
						}

						if ( ! opacityDisableInEditor ) {
							blockNotSelected = '';
						}

						opacitySelector = blockNotSelected + opacitySelector;

						if ( 'undefined' !== typeof data.device ) {
							if ( 'desktop' === data.device && 'generateblocks.editor.desktopCSS' !== currentFilter() ) {
								return;
							}

							if ( 'tablet-only' === data.device && 'generateblocks.editor.tabletOnlyCSS' !== currentFilter() ) {
								return;
							}

							if ( 'tablet' === data.device && 'generateblocks.editor.tabletCSS' !== currentFilter() ) {
								return;
							}

							if ( 'mobile' === data.device && 'generateblocks.editor.mobileCSS' !== currentFilter() ) {
								return;
							}
						}

						if ( 'undefined' !== typeof data.opacity ) {
							addToCSS( css, opacitySelector, {
								opacity: hasNumericValue( data.opacity ) ? data.opacity : 1,
								'mix-blend-mode': data.mixBlendMode ? data.mixBlendMode : '',
							} );
						}
					} );
				} );
			}
		}

		if ( useTransition ) {
			const transitionData = {};

			if ( transitions ) {
				Object.keys( transitions ).forEach( function( key ) {
					const selectorData = getEffectSelector( transitions, attributes, selector, key );

					if ( 'undefined' === typeof transitionData[ selectorData.element ] ) {
						transitionData[ selectorData.element ] = {
							selector: selectorData.effectSelector,
							transitions: [],
							state: transitions[ key ].state,
							device: transitions[ key ].device,
						};
					}

					const transitionDelay = hasNumericValue( transitions[ key ].delay ) ? transitions[ key ].delay + 's' : '';
					const transition = transitions[ key ].property + ' ' + valueWithUnit( transitions[ key ].duration, 's' ) + ' ' + transitions[ key ].timingFunction + ' ' + transitionDelay;
					transitionData[ selectorData.element ].transitions.push( transition );

					Object.keys( transitionData ).forEach( function( target ) {
						const data = transitionData[ target ];

						if ( 'undefined' !== typeof data.device ) {
							if ( 'desktop' === data.device && 'generateblocks.editor.desktopCSS' !== currentFilter() ) {
								return;
							}

							if ( 'tablet-only' === data.device && 'generateblocks.editor.tabletOnlyCSS' !== currentFilter() ) {
								return;
							}

							if ( 'tablet' === data.device && 'generateblocks.editor.tabletCSS' !== currentFilter() ) {
								return;
							}

							if ( 'mobile' === data.device && 'generateblocks.editor.mobileCSS' !== currentFilter() ) {
								return;
							}
						}

						if ( 'undefined' !== typeof data.transitions ) {
							addToCSS( css, data.selector, {
								transition: data.transitions.join( ' ' ),
							} );
						}
					} );
				} );
			}
		}

		if ( useTransform ) {
			const transformData = getTransformData( attributes, selector );

			Object.keys( transformData ).forEach( function( target ) {
				const data = transformData[ target ];

				let transformSelector = data.selector;

				let transformNotSelected = '.wp-block:not(.is-selected):not(.has-child-selected)';

				// GB < 1.5.0 had the .wp-block selector as a parent to the block itself.
				// hasColorGroups is only true in GB 1.5.0.
				if ( ! generateBlocksPro.hasColorGroups ) {
					transformNotSelected += ' > ';
				}

				if ( ! transformDisableInEditor ) {
					transformNotSelected = '';
				}

				transformSelector = transformNotSelected + transformSelector;

				if ( 'undefined' !== typeof data.device ) {
					if ( 'desktop' === data.device && 'generateblocks.editor.desktopCSS' !== currentFilter() ) {
						return;
					}

					if ( 'tablet-only' === data.device && 'generateblocks.editor.tabletOnlyCSS' !== currentFilter() ) {
						return;
					}

					if ( 'tablet' === data.device && 'generateblocks.editor.tabletCSS' !== currentFilter() ) {
						return;
					}

					if ( 'mobile' === data.device && 'generateblocks.editor.mobileCSS' !== currentFilter() ) {
						return;
					}
				}

				if ( 'undefined' !== typeof data.transforms ) {
					addToCSS( css, transformSelector, {
						transform: data.transforms.join( ' ' ),
					} );
				}
			} );
		}

		if ( useFilter ) {
			const filterData = getCSSFilterData( attributes, selector );

			Object.keys( filterData ).forEach( function( target ) {
				const data = filterData[ target ];

				if ( 'undefined' !== typeof data.device ) {
					if ( 'desktop' === data.device && 'generateblocks.editor.desktopCSS' !== currentFilter() ) {
						return;
					}

					if ( 'tablet-only' === data.device && 'generateblocks.editor.tabletOnlyCSS' !== currentFilter() ) {
						return;
					}

					if ( 'tablet' === data.device && 'generateblocks.editor.tabletCSS' !== currentFilter() ) {
						return;
					}

					if ( 'mobile' === data.device && 'generateblocks.editor.mobileCSS' !== currentFilter() ) {
						return;
					}
				}

				if ( 'undefined' !== typeof data.filters ) {
					addToCSS( css, data.selector, {
						filter: data.filters.join( ' ' ),
					} );
				}
			} );
		}

		if ( useTextShadow ) {
			const textShadowData = {};

			if ( textShadows ) {
				Object.keys( textShadows ).forEach( function( key ) {
					const selectorData = getEffectSelector( textShadows, attributes, selector, key );

					const textShadowValue = sprintf(
						'%1$s %2$s %3$s %4$s',
						hexToRGBA( textShadows[ key ].color, textShadows[ key ].colorOpacity ),
						textShadows[ key ].xOffset ? textShadows[ key ].xOffset + 'px' : 0,
						textShadows[ key ].yOffset ? textShadows[ key ].yOffset + 'px' : 0,
						textShadows[ key ].blur ? textShadows[ key ].blur + 'px' : 0,
					);

					if ( 'undefined' === typeof textShadowData[ selectorData.element ] ) {
						textShadowData[ selectorData.element ] = {
							selector: selectorData.effectSelector,
							textShadow: textShadowValue,
							state: textShadows[ key ].state,
							device: textShadows[ key ].device,
						};
					}

					Object.keys( textShadowData ).forEach( function( target ) {
						const data = textShadowData[ target ];

						if ( 'undefined' !== typeof data.textShadow ) {
							addToCSS( css, data.selector, {
								'text-shadow': data.textShadow,
							} );
						}
					} );
				} );
			}
		}
	}

	return css;
}

addFilter(
	'blocks.registerBlockType',
	'generateblocks-pro/effects/add-attributes',
	addAttributes
);

addFilter(
	'generateblocks.panel.containerDocumentation',
	'generateblocks-pro/effects/add-container-controls',
	addControls
);

addFilter(
	'generateblocks.panel.buttonDocumentation',
	'generateblocks-pro/effects/add-button-controls',
	addControls
);

addFilter(
	'generateblocks.panel.headlineDocumentation',
	'generateblocks-pro/effects/add-headline-controls',
	addControls
);

addFilter(
	'generateblocks.panel.imageDocumentation',
	'generateblocks-pro/effects/add-image-controls',
	addControls
);

addFilter(
	'generateblocks.editor.mainCSS',
	'generateblocks-pro/effects/add-main-css',
	addCSS
);

addFilter(
	'generateblocks.editor.desktopCSS',
	'generateblocks-pro/effects/add-desktop-css',
	addCSS
);

addFilter(
	'generateblocks.editor.tabletOnlyCSS',
	'generateblocks-pro/effects/add-tablet-only-css',
	addCSS
);

addFilter(
	'generateblocks.editor.tabletCSS',
	'generateblocks-pro/effects/add-tablet-css',
	addCSS
);

addFilter(
	'generateblocks.editor.mobileCSS',
	'generateblocks-pro/effects/add-mobile-css',
	addCSS
);
