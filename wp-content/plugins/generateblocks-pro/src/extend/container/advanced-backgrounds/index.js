import hexToRGBA from '../../../utils/hex-to-rgba';
import addToCSS from '../../../utils/add-to-css';
import hasNumericValue from '../../../utils/has-numeric-value';
import BackgroundPanelItem from '../../../components/background-panel-item';
import getEffectSelector from '../../../utils/get-effect-selector';
import shorthandCSS from '../../../utils/shorthand-css';
import valueWithUnit from '../../../utils/value-with-unit';
import getIcon from '../../../utils/get-icon';
//import './editor.scss';

/**
 * WordPress Dependencies
 */
import {
	__,
	sprintf,
} from '@wordpress/i18n';

import {
	applyFilters,
	addFilter,
	currentFilter,
} from '@wordpress/hooks';

import {
	Fragment,
} from '@wordpress/element';

import {
	Button,
	Dropdown,
	ToggleControl,
} from '@wordpress/components';

/**
 * Add custom attribute for mobile visibility.
 *
 * @param {Object} settings Settings for the block.
 *
 * @return {Object} settings Modified settings.
 */
function addAttributes( settings ) {
	if ( typeof settings.attributes !== 'undefined' && 'generateblocks/container' === settings.name ) {
		settings.attributes = Object.assign( settings.attributes, {
			useAdvBackgrounds: {
				type: 'boolean',
				default: generateBlocksDefaults.container.useAdvBackgrounds,
			},
			advBackgrounds: {
				type: 'array',
				default: [],
			},
		} );
	}

	return settings;
}

function addGradientControls( output, id, props ) {
	if ( 'containerBackground' !== id ) {
		return output;
	}

	const {
		attributes,
		setAttributes,
	} = props;

	const {
		useAdvBackgrounds,
		advBackgrounds,
	} = attributes;

	return (
		<Fragment>
			<div className="gblocks-advanced-dropdown-item">
				<ToggleControl
					label={
						advBackgrounds.length > 0 ? (
							/* translators: Number of gradients. */
							sprintf( __( 'Advanced (%s)', 'generateblocks-pro' ), advBackgrounds.length )
						) : (
							__( 'Advanced', 'generateblocks-pro' )
						)
					}
					checked={ !! useAdvBackgrounds }
					onChange={ ( value ) => {
						setAttributes( {
							useAdvBackgrounds: value,
						} );
					} }
				/>
				<Dropdown
					position="top left"
					focusOnMount={ 'container' }
					contentClassName="gblocks-advanced-dropdown gblocks-background-dropdown"
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
								<BackgroundPanelItem { ...props }
									effectName="advBackgrounds"
									effectOptions={ [
										{
											label: __( 'Self', 'generateblocks-pro' ),
											value: 'self',
										},
										{
											label: __( 'Pseudo Element', 'generateblocks-pro' ),
											value: 'pseudo-element',
										},
									] }
								/>

								<div className="gblocks-advanced-dropdown-actions">
									<Button
										isSecondary
										onClick={ () => {
											const gradientValues = [ ...advBackgrounds ];

											gradientValues.push( {
												target: 'self',
												device: 'all',
												state: 'normal',
											} );

											setAttributes( { advBackgrounds: gradientValues } );
										} }
									>
										{ __( 'Add Background', 'generateblocks-pro' ) }
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

			{ ! useAdvBackgrounds && output }
		</Fragment>
	);
}

function addCSS( css, props, name ) {
	const allowedAreas = [ 'container' ];

	if ( ! allowedAreas.includes( name ) ) {
		return css;
	}

	const {
		media,
	} = props;

	const attributes = applyFilters( 'generateblocks.editor.cssAttrs', props.attributes, props );

	const {
		uniqueId,
		advBackgrounds,
		useAdvBackgrounds,
		borderRadiusTopRight,
		borderRadiusBottomRight,
		borderRadiusBottomLeft,
		borderRadiusTopLeft,
		borderRadiusTopRightTablet,
		borderRadiusBottomRightTablet,
		borderRadiusBottomLeftTablet,
		borderRadiusTopLeftTablet,
		borderRadiusTopRightMobile,
		borderRadiusBottomRightMobile,
		borderRadiusBottomLeftMobile,
		borderRadiusTopLeftMobile,
		borderRadiusUnit,
		innerZindex,
	} = attributes;

	const selector = '.gb-container-' + uniqueId;

	const backgroundData = {};
	let hasBeforePseudo = false;
	let hasAfterPseudo = false;
	let innerZIndexValue = innerZindex;

	if ( useAdvBackgrounds && advBackgrounds.length > 0 ) {
		Object.keys( advBackgrounds ).forEach( function( key ) {
			const selectorData = getEffectSelector( advBackgrounds, attributes, selector, key );

			if ( 'gradient' === advBackgrounds[ key ].type ) {
				let gradientColorStopOneValue = '',
					gradientColorStopTwoValue = '';

				const gradientColorOne = hexToRGBA( advBackgrounds[ key ].colorOne, advBackgrounds[ key ].colorOneOpacity );
				const gradientColorTwo = hexToRGBA( advBackgrounds[ key ].colorTwo, advBackgrounds[ key ].colorTwoOpacity );

				if ( gradientColorOne && hasNumericValue( advBackgrounds[ key ].stopOne ) ) {
					gradientColorStopOneValue = ' ' + advBackgrounds[ key ].stopOne + '%';
				}

				if ( gradientColorTwo && hasNumericValue( advBackgrounds[ key ].stopTwo ) ) {
					gradientColorStopTwoValue = ' ' + advBackgrounds[ key ].stopTwo + '%';
				}

				const gradientValue = 'linear-gradient(' + advBackgrounds[ key ].direction + 'deg, ' + gradientColorOne + gradientColorStopOneValue + ', ' + gradientColorTwo + gradientColorStopTwoValue + ')';

				if ( 'undefined' === typeof backgroundData[ selectorData.element ] ) {
					backgroundData[ selectorData.element ] = {
						selector: selectorData.effectSelector,
						gradient: gradientValue,
						state: advBackgrounds[ key ].state,
						device: advBackgrounds[ key ].device,
						target: advBackgrounds[ key ].target,
						type: advBackgrounds[ key ].type,
					};
				}
			}

			if ( 'image' === advBackgrounds[ key ].type ) {
				if ( 'undefined' === typeof backgroundData[ selectorData.element ] ) {
					backgroundData[ selectorData.element ] = {
						selector: selectorData.effectSelector,
						state: advBackgrounds[ key ].state,
						device: advBackgrounds[ key ].device,
						target: advBackgrounds[ key ].target,
						url: advBackgrounds[ key ].url,
						size: advBackgrounds[ key ].size,
						position: advBackgrounds[ key ].position,
						repeat: advBackgrounds[ key ].repeat,
						attachment: advBackgrounds[ key ].attachment,
						type: advBackgrounds[ key ].type,
					};
				}
			}

			Object.keys( backgroundData ).forEach( function( target ) {
				const data = backgroundData[ target ];

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

				if ( 'gradient' === data.type ) {
					if ( 'pseudo-element' === data.target && ! hasAfterPseudo ) {
						addToCSS( css, data.selector, {
							content: '""',
							'z-index': '0',
							position: 'absolute',
							top: '0',
							right: '0',
							bottom: '0',
							left: '0',
						} );

						addToCSS( css, '.gb-container-' + uniqueId, {
							position: 'relative',
							overflow: 'hidden',
						} );

						hasAfterPseudo = true;
					}

					addToCSS( css, data.selector, {
						'background-image': data.gradient,
					} );
				}

				if ( 'image' === data.type ) {
					const imageURL = applyFilters( 'generateblocks.editor.bgImageURLTablet', data.url, media );

					if ( 'pseudo-element' === data.target ) {
						if ( ! hasBeforePseudo ) {
							addToCSS( css, data.selector, {
								content: '""',
								'z-index': '0',
								position: 'absolute',
								top: '0',
								right: '0',
								bottom: '0',
								left: '0',
							} );

							if ( 'undefined' === typeof data.device || 'desktop' === data.device ) {
								addToCSS( css, data.selector, {
									'border-radius': shorthandCSS( borderRadiusTopLeft, borderRadiusTopRight, borderRadiusBottomRight, borderRadiusBottomLeft, borderRadiusUnit ),
								} );
							} else if ( 'tablet' === data.device ) {
								addToCSS( css, data.selector, {
									'border-top-left-radius': valueWithUnit( borderRadiusTopLeftTablet, borderRadiusUnit ),
									'border-top-right-radius': valueWithUnit( borderRadiusTopRightTablet, borderRadiusUnit ),
									'border-bottom-right-radius': valueWithUnit( borderRadiusBottomRightTablet, borderRadiusUnit ),
									'border-bottom-left-radius': valueWithUnit( borderRadiusBottomLeftTablet, borderRadiusUnit ),
								} );
							} else if ( 'mobile' === data.device ) {
								addToCSS( css, data.selector, {
									'border-top-left-radius': valueWithUnit( borderRadiusTopLeftMobile, borderRadiusUnit ),
									'border-top-right-radius': valueWithUnit( borderRadiusTopRightMobile, borderRadiusUnit ),
									'border-bottom-right-radius': valueWithUnit( borderRadiusBottomRightMobile, borderRadiusUnit ),
									'border-bottom-left-radius': valueWithUnit( borderRadiusBottomLeftMobile, borderRadiusUnit ),
								} );
							}

							hasBeforePseudo = true;

							if ( 'undefined' === typeof attributes.blockVersion ) {
								if ( ! innerZIndexValue ) {
									innerZIndexValue = 1;
								}
							}
						}

						addToCSS( css, '.gb-container-' + uniqueId, {
							position: 'relative',
							overflow: 'hidden',
						} );
					}

					addToCSS( css, data.selector, {
						'background-image': !! imageURL ? 'url(' + imageURL + ')' : null,
						'background-size': data.size,
						'background-position': data.position,
						'background-repeat': data.repeat,
						'background-attachment': data.attachment,
					} );
				}
			} );
		} );

		if ( innerZIndexValue || 0 === innerZIndexValue ) {
			addToCSS( css, '.gb-container-' + uniqueId + ' > .gb-inside-container', {
				'z-index': innerZIndexValue,
				position: 'relative',
			} );
		}
	}

	return css;
}

addFilter(
	'blocks.registerBlockType',
	'generateblocks-pro/container-backgrounds/add-attributes',
	addAttributes
);

addFilter(
	'generateblocks.editor.panelContents',
	'generateblocks-pro/container-backgrounds/add-controls',
	addGradientControls
);

addFilter(
	'generateblocks.editor.mainCSS',
	'generateblocks-pro/container-backgrounds/add-main-css',
	addCSS
);

addFilter(
	'generateblocks.editor.desktopCSS',
	'generateblocks-pro/container-backgrounds/add-desktop-css',
	addCSS
);

addFilter(
	'generateblocks.editor.tabletCSS',
	'generateblocks-pro/container-backgrounds/add-tablet-css',
	addCSS
);

addFilter(
	'generateblocks.editor.tabletOnlyCSS',
	'generateblocks-pro/container-backgrounds/add-tablet-only-css',
	addCSS
);

addFilter(
	'generateblocks.editor.mobileCSS',
	'generateblocks-pro/container-backgrounds/add-mobile-css',
	addCSS
);
