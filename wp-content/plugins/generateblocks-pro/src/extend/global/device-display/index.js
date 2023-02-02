import './editor.scss';
import addToCSS from '../../../utils/add-to-css';
/**
 * WordPress Dependencies
 */
import {
	__,
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
	InspectorAdvancedControls,
} from '@wordpress/block-editor';

import {
	createHigherOrderComponent,
} from '@wordpress/compose';

import {
	ToggleControl,
	Notice,
} from '@wordpress/components';

const allowedBlocks = [ 'generateblocks/container', 'generateblocks/button', 'generateblocks/button-container', 'generateblocks/headline', 'generateblocks/image' ];

/**
 * Add custom attribute for mobile visibility.
 *
 * @param {Object} settings Settings for the block.
 *
 * @return {Object} settings Modified settings.
 */
function addAttributes( settings ) {
	if ( ! allowedBlocks.includes( settings.name ) ) {
		return settings;
	}

	if ( typeof settings.attributes !== 'undefined' ) {
		settings.attributes = Object.assign( settings.attributes, {
			hideOnDesktop: {
				type: 'boolean',
				default: false,
			},
			hideOnTablet: {
				type: 'boolean',
				default: false,
			},
			hideOnMobile: {
				type: 'boolean',
				default: false,
			},
		} );
	}

	return settings;
}

/**
 * Add mobile visibility controls on Advanced Block Panel.
 *
 * @param {Function} BlockEdit Block edit component.
 *
 * @return {Function} BlockEdit Modified block edit component.
 */
const withAdvancedControls = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			if ( props.isSelected && allowedBlocks.includes( props.name ) ) {
				const {
					attributes,
					setAttributes,
				} = props;

				const {
					hideOnDesktop,
					hideOnTablet,
					hideOnMobile,
				} = attributes;

				return (
					<Fragment>
						<BlockEdit { ...props } />

						<InspectorAdvancedControls>
							<ToggleControl
								label={ __( 'Hide on desktop', 'generateblocks-pro' ) }
								checked={ !! hideOnDesktop }
								onChange={ ( value ) => {
									setAttributes( {
										hideOnDesktop: value,
									} );
								} }
							/>

							<ToggleControl
								label={ __( 'Hide on tablet', 'generateblocks-pro' ) }
								checked={ !! hideOnTablet }
								onChange={ ( value ) => {
									setAttributes( {
										hideOnTablet: value,
									} );
								} }
							/>

							<ToggleControl
								label={ __( 'Hide on mobile', 'generateblocks-pro' ) }
								checked={ !! hideOnMobile }
								onChange={ ( value ) => {
									setAttributes( {
										hideOnMobile: value,
									} );
								} }
							/>
						</InspectorAdvancedControls>
					</Fragment>
				);
			}

			return <BlockEdit { ...props } />;
		};
	},
	'withAdvancedControls'
);

function addCSS( css, props ) {
	const {
		clientId,
	} = props;

	const attributes = applyFilters( 'generateblocks.editor.cssAttrs', props.attributes, props );

	const {
		hideOnDesktop,
		hideOnTablet,
		hideOnMobile,
	} = attributes;

	let hideOnDevice = hideOnDesktop;

	if ( 'generateblocks.editor.tabletOnlyCSS' === currentFilter() ) {
		hideOnDevice = hideOnTablet;
	} else if ( 'generateblocks.editor.mobileCSS' === currentFilter() ) {
		hideOnDevice = hideOnMobile;
	}

	if ( hideOnDevice ) {
		addToCSS( css, '#block-' + clientId, {
			display: 'none !important',
		} );
	}

	return css;
}

function addDeviceMessage( output, id, data ) {
	if ( 'afterResponsiveTabs' !== id ) {
		return output;
	}

	const {
		selectedDevice,
		attributes,
		setAttributes,
	} = data;

	const {
		hideOnDesktop,
		hideOnTablet,
		hideOnMobile,
	} = attributes;

	if ( 'Desktop' === selectedDevice && ! hideOnDesktop ) {
		return output;
	}

	if ( 'Tablet' === selectedDevice && ! hideOnTablet ) {
		return output;
	}

	if ( 'Mobile' === selectedDevice && ! hideOnMobile ) {
		return output;
	}

	return (
		<Fragment>
			<Notice
				className="gblocks-device-hidden-notice"
				status="info"
				isDismissible={ false }
			>
				{ __( 'This block is hidden on this device.', 'generateblocks-pro' ) }

				{ 'Desktop' === selectedDevice &&
					<ToggleControl
						label={ __( 'Hide on desktop', 'generateblocks-pro' ) }
						checked={ !! hideOnDesktop }
						onChange={ ( value ) => {
							setAttributes( {
								hideOnDesktop: value,
							} );
						} }
					/>
				}

				{ 'Tablet' === selectedDevice &&
					<ToggleControl
						label={ __( 'Hide on tablet', 'generateblocks-pro' ) }
						checked={ !! hideOnTablet }
						onChange={ ( value ) => {
							setAttributes( {
								hideOnTablet: value,
							} );
						} }
					/>
				}

				{ 'Mobile' === selectedDevice &&
					<ToggleControl
						label={ __( 'Hide on mobile', 'generateblocks-pro' ) }
						checked={ !! hideOnMobile }
						onChange={ ( value ) => {
							setAttributes( {
								hideOnMobile: value,
							} );
						} }
					/>
				}
			</Notice>

			{ output }
		</Fragment>
	);
}

addFilter(
	'blocks.registerBlockType',
	'generateblocks-pro/device-display/add-attributes',
	addAttributes
);

addFilter(
	'editor.BlockEdit',
	'generateblocks-pro/device-display/add-control',
	withAdvancedControls
);

addFilter(
	'generateblocks.editor.desktopCSS',
	'generateblocks-pro/device-display/add-desktop-css',
	addCSS
);

addFilter(
	'generateblocks.editor.tabletOnlyCSS',
	'generateblocks-pro/device-display/add-tablet-only-css',
	addCSS
);

addFilter(
	'generateblocks.editor.mobileCSS',
	'generateblocks-pro/device-display/add-mobile-css',
	addCSS
);

addFilter(
	'generateblocks.editor.controls',
	'generateblocks-pro/device-display/add-hidden-message',
	addDeviceMessage
);
