import ColorPicker from '../../../components/color-picker';
import getIcon from '../../../utils/get-icon';
import hexToRGBA from '../../../utils/hex-to-rgba';
import addToCSS from '../../../utils/add-to-css';

/**
 * WordPress Dependencies
 */
import {
	__,
} from '@wordpress/i18n';

import {
	addFilter,
	applyFilters,
} from '@wordpress/hooks';

import {
	Fragment,
} from '@wordpress/element';

import {
	TabPanel,
	PanelBody,
} from '@wordpress/components';

/**
 * Add custom attribute for mobile visibility.
 *
 * @param {Object} settings Settings for the block.
 * @return {Object} settings Modified settings.
 */
function addAttributes( settings ) {
	if ( typeof settings.attributes !== 'undefined' && 'generateblocks/container' === settings.name ) {
		settings.attributes = Object.assign( settings.attributes, {
			backgroundColorHover: {
				type: 'string',
				default: '',
			},
			backgroundColorHoverOpacity: {
				type: 'number',
				default: 1,
			},
			textColorHover: {
				type: 'string',
				default: '',
			},
			borderColorHover: {
				type: 'string',
				default: '',
			},
			borderColorHoverOpacity: {
				type: 'number',
				default: 1,
			},
		} );
	}

	return settings;
}

function addColorItems( items, props ) {
	if ( 'generateblocks/container' !== props.name ) {
		return items;
	}

	const newItems = [
		{
			group: 'background',
			attribute: 'backgroundColorHover',
			tooltip: __( 'Hover', 'generateblocks-pro' ),
			alpha: true,
		},
		{
			group: 'text',
			attribute: 'textColorHover',
			tooltip: __( 'Hover', 'generateblocks-pro' ),
			alpha: false,
		},
		{
			group: 'border',
			attribute: 'borderColorHover',
			tooltip: __( 'Hover', 'generateblocks-pro' ),
			alpha: true,
		},
	];

	items.forEach( ( colorItem, index ) => {
		newItems.forEach( ( newColorItem ) => {
			if (
				newColorItem.group === colorItem.group &&
				! colorItem.items.some( ( item ) => item.attribute === newColorItem.attribute )
			) {
				items[ index ].items.push(
					{
						tooltip: newColorItem.tooltip,
						attribute: newColorItem.attribute,
						alpha: newColorItem.alpha,
					}
				);
			}
		} );
	} );

	return items;
}

function addControls( output, data ) {
	if ( generateBlocksPro.hasColorGroups ) {
		return output;
	}

	const {
		attributes,
		setAttributes,
	} = data.props;

	const {
		backgroundColor,
		backgroundColorOpacity,
		backgroundColorHover,
		backgroundColorHoverOpacity,
		textColor,
		textColorHover,
		linkColor,
		linkColorHover,
		borderColor,
		borderColorOpacity,
		borderColorHover,
		borderColorHoverOpacity,
	} = attributes;

	const getDeviceType = () => {
		return data.props.deviceType ? data.props.deviceType : data.state.selectedDevice;
	};

	return (
		<Fragment>
			{ 'Desktop' === getDeviceType() &&
				<PanelBody
					title={ __( 'Colors', 'generateblocks-pro' ) }
					initialOpen={ false }
					icon={ getIcon( 'colors' ) }
					className={ 'gblocks-panel-label' }
				>
					<Fragment>
						<TabPanel className="layout-tab-panel gblocks-control-tabs"
							activeClass="active-tab"
							tabs={ [
								{
									name: 'button-colors',
									title: __( 'Normal', 'generateblocks-pro' ),
									className: 'button-colors',
								},
								{
									name: 'button-colors-hover',
									title: __( 'Hover', 'generateblocks-pro' ),
									className: 'button-colors-hover',
								},
							] }>
							{
								( tab ) => {
									const isNormal = tab.name === 'button-colors';

									return (
										<div>
											{ isNormal ? (
												<Fragment>
													<ColorPicker
														label={ __( 'Background Color', 'generateblocks-pro' ) }
														value={ backgroundColor }
														alpha={ true }
														valueOpacity={ backgroundColorOpacity }
														attrOpacity={ 'backgroundColorOpacity' }
														key={ 'buttonBackgroundColor' }
														onChange={ ( nextBackgroundColor ) =>
															setAttributes( {
																backgroundColor: nextBackgroundColor,
															} )
														}
														onOpacityChange={ ( value ) =>
															setAttributes( {
																backgroundColorOpacity: value,
															} )
														}
													/>

													<ColorPicker
														label={ __( 'Text Color', 'generateblocks-pro' ) }
														value={ textColor }
														alpha={ false }
														key={ 'buttonTextColor' }
														onChange={ ( nextTextColor ) =>
															setAttributes( {
																textColor: nextTextColor,
															} )
														}
													/>

													<ColorPicker
														label={ __( 'Link Color', 'generateblocks-pro' ) }
														value={ linkColor }
														alpha={ false }
														onChange={ ( nextLinkColor ) =>
															setAttributes( {
																linkColor: nextLinkColor,
															} )
														}
													/>

													<ColorPicker
														label={ __( 'Border Color', 'generateblocks-pro' ) }
														value={ borderColor }
														alpha={ true }
														valueOpacity={ borderColorOpacity }
														attrOpacity={ 'borderColorOpacity' }
														key={ 'buttonBorderColor' }
														onChange={ ( value ) =>
															setAttributes( {
																borderColor: value,
															} )
														}
														onOpacityChange={ ( value ) =>
															setAttributes( {
																borderColorOpacity: value,
															} )
														}
													/>
												</Fragment>

											) : (

												<Fragment>
													<ColorPicker
														label={ __( 'Background Color', 'generateblocks-pro' ) }
														value={ backgroundColorHover }
														alpha={ true }
														valueOpacity={ backgroundColorHoverOpacity }
														attrOpacity={ 'backgroundColorHoverOpacity' }
														key={ 'buttonBackgroundColorHover' }
														onChange={ ( nextBackgroundColorHover ) =>
															setAttributes( {
																backgroundColorHover: nextBackgroundColorHover,
															} )
														}
														onOpacityChange={ ( value ) =>
															setAttributes( {
																backgroundColorHoverOpacity: value,
															} )
														}
													/>

													<ColorPicker
														label={ __( 'Text Color', 'generateblocks-pro' ) }
														value={ textColorHover }
														alpha={ false }
														key={ 'buttonTextColorHover' }
														onChange={ ( nextTextColorHover ) =>
															setAttributes( {
																textColorHover: nextTextColorHover,
															} )
														}
													/>

													<ColorPicker
														label={ __( 'Link Color', 'generateblocks-pro' ) }
														value={ linkColorHover }
														alpha={ false }
														onChange={ ( nextLinkColorHover ) =>
															setAttributes( {
																linkColorHover: nextLinkColorHover,
															} )
														}
													/>

													<ColorPicker
														label={ __( 'Border Color', 'generateblocks-pro' ) }
														value={ borderColorHover }
														alpha={ true }
														valueOpacity={ borderColorHoverOpacity }
														attrOpacity={ 'borderColorHoverOpacity' }
														key={ 'buttonBorderColorHover' }
														onChange={ ( value ) =>
															setAttributes( {
																borderColorHover: value,
															} )
														}
														onOpacityChange={ ( value ) =>
															setAttributes( {
																borderColorHoverOpacity: value,
															} )
														}
													/>
												</Fragment>
											) }
										</div>
									);
								}
							}
						</TabPanel>
					</Fragment>
				</PanelBody>
			}
		</Fragment>
	);
}

function addMainCSS( css, props, name ) {
	const attributes = applyFilters( 'generateblocks.editor.cssAttrs', props.attributes, props );

	const {
		uniqueId,
		backgroundColor,
		backgroundColorHover,
		backgroundColorOpacity,
		backgroundColorHoverOpacity,
		textColor,
		textColorHover,
		borderColor,
		borderColorHover,
		borderColorOpacity,
		borderColorHoverOpacity,
	} = attributes;

	if ( 'container' === name ) {
		if ( ! generateBlocksPro.hasRgbaSupport ) {
			addToCSS( css, '.gb-container-' + uniqueId, {
				'background-color': hexToRGBA( backgroundColor, backgroundColorOpacity ),
				'border-color': hexToRGBA( borderColor, borderColorOpacity ),
				color: textColor,
			} );
		}

		addToCSS( css, '.gb-container-' + uniqueId + ':hover', {
			'background-color': hexToRGBA( backgroundColorHover, backgroundColorHoverOpacity ),
			'border-color': hexToRGBA( borderColorHover, borderColorHoverOpacity ),
			color: textColorHover,
		} );

		const headlineSelectors = [
			'.editor-styles-wrapper .gb-container-' + uniqueId + ':hover h1',
			'.editor-styles-wrapper .gb-container-' + uniqueId + ':hover h2',
			'.editor-styles-wrapper .gb-container-' + uniqueId + ':hover h3',
			'.editor-styles-wrapper .gb-container-' + uniqueId + ':hover h4',
			'.editor-styles-wrapper .gb-container-' + uniqueId + ':hover h5',
			'.editor-styles-wrapper .gb-container-' + uniqueId + ':hover h6',
		];

		addToCSS( css, headlineSelectors.join( ',' ), {
			color: textColorHover,
		} );
	}

	return css;
}

addFilter(
	'blocks.registerBlockType',
	'generateblocks-pro/container-colors/add-attributes',
	addAttributes
);

addFilter(
	'generateblocks.panel.containerColors',
	'generateblocks-pro/container-colors/add-controls',
	addControls
);

addFilter(
	'generateblocks.editor.colorGroupItems',
	'generateblocks-pro/container-colors/add-color-items',
	addColorItems
);

addFilter(
	'generateblocks.editor.mainCSS',
	'generateblocks-pro/container-colors/add-main-css',
	addMainCSS
);
