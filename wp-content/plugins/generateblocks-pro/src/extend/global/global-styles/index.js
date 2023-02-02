import noStyleAttributes from '../../../utils/no-style-attributes';
import GlobalStylePicker from '../../../components/global-style-picker';

/**
 * WordPress Dependencies
 */
import {
	__,
} from '@wordpress/i18n';

import {
	addFilter,
} from '@wordpress/hooks';

import {
	Fragment,
} from '@wordpress/element';

const allowedBlocks = [
	'generateblocks/container',
	'generateblocks/button',
	'generateblocks/button-container',
	'generateblocks/headline',
	'generateblocks/grid',
	'generateblocks/image',
];

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
	} else if ( 'generateblocks/button-container' === settings.name ) {
		blockName = 'buttonContainer';
	} else if ( 'generateblocks/headline' === settings.name ) {
		blockName = 'headline';
	} else if ( 'generateblocks/grid' === settings.name ) {
		blockName = 'gridContainer';
	} else if ( 'generateblocks/image' === settings.name ) {
		blockName = 'image';
	}

	if ( typeof settings.attributes !== 'undefined' ) {
		settings.attributes = Object.assign( settings.attributes, {
			isGlobalStyle: {
				type: 'boolean',
				default: false,
			},
			useGlobalStyle: {
				type: 'boolean',
				default: generateBlocksDefaults[ blockName ].useGlobalStyle,
			},
			globalStyleId: {
				type: 'string',
				default: generateBlocksDefaults[ blockName ].globalStyleId,
			},
			globalStyleLabel: {
				type: 'string',
				default: '',
			},
		} );
	}

	return settings;
}

function addControls( output, id, props ) {
	if ( 'afterResponsiveTabs' !== id ) {
		return output;
	}

	const {
		name,
	} = props;

	if ( ! allowedBlocks.includes( name ) ) {
		return output;
	}

	const blockName = name.replace( 'generateblocks/', '' );

	const globalIdOptions = [ {
		label: __( 'Choose…', 'generateblocks-pro' ),
		value: '',
	} ];

	const ids = generateBlocksPro.globalStyleIds[ blockName ];

	if ( ids ) {
		Object.keys( ids ).forEach( ( globalId ) => {
			let styleLabel = ids[ globalId ];

			if (
				generateBlocksPro.globalStyleAttrs[ blockName ] &&
				generateBlocksPro.globalStyleAttrs[ blockName ][ ids[ globalId ] ] &&
				generateBlocksPro.globalStyleAttrs[ blockName ][ ids[ globalId ] ].globalStyleLabel
			) {
				styleLabel = generateBlocksPro.globalStyleAttrs[ blockName ][ ids[ globalId ] ].globalStyleLabel;
			}

			globalIdOptions.push( {
				label: styleLabel || ids[ globalId ],
				value: ids[ globalId ],
			} );
		} );
	}

	if ( ! generateBlocksPro.isGlobalStyle && globalIdOptions.length < 2 ) {
		return output;
	}

	return (
		<Fragment>
			<GlobalStylePicker
				{ ...props }
				options={ globalIdOptions }
			/>

			{ output }
		</Fragment>
	);
}

function addCustomAttributes( blockHtmlAttributes, blockName, blockAttributes ) {
	if ( ! allowedBlocks.includes( blockName ) ) {
		return blockHtmlAttributes;
	}

	let id = '';

	if ( 'generateblocks/button' === blockName ) {
		id = 'gb-button-' + blockAttributes.globalStyleId;
	}

	if ( 'generateblocks/container' === blockName ) {
		id = 'gb-container-' + blockAttributes.globalStyleId;
	}

	if ( 'generateblocks/headline' === blockName ) {
		id = 'gb-headline-' + blockAttributes.globalStyleId;
	}

	if ( 'generateblocks/button-container' === blockName ) {
		id = 'gb-button-wrapper-' + blockAttributes.globalStyleId;
	}

	if ( 'generateblocks/grid' === blockName ) {
		id = 'gb-grid-wrapper-' + blockAttributes.globalStyleId;
	}

	if ( 'generateblocks/image' === blockName ) {
		id = 'gb-image-' + blockAttributes.globalStyleId;
	}

	if ( blockAttributes.useGlobalStyle && blockAttributes.globalStyleId ) {
		blockHtmlAttributes = Object.assign( blockHtmlAttributes, {
			className: blockHtmlAttributes.className + ' ' + id,
		} );
	}

	return blockHtmlAttributes;
}

function filterCSS( attributes, props ) {
	if ( attributes.useGlobalStyle && '' !== attributes.globalStyleId ) {
		const blockName = props.name.replace( 'generateblocks/', '' );
		const globalBlocks = generateBlocksPro.globalStyleAttrs[ blockName ] || undefined;
		const globalAttrs = globalBlocks ? globalBlocks[ attributes.globalStyleId ] : undefined;

		if ( 'undefined' === typeof globalAttrs || ! globalAttrs ) {
			return attributes;
		}

		let defaultBlockName = 'container';

		if ( 'generateblocks/button' === props.name ) {
			defaultBlockName = 'button';
		} else if ( 'generateblocks/button-container' === props.name ) {
			defaultBlockName = 'buttonContainer';
		} else if ( 'generateblocks/headline' === props.name ) {
			defaultBlockName = 'headline';
		} else if ( 'generateblocks/grid' === props.name ) {
			defaultBlockName = 'gridContainer';
		} else if ( 'generateblocks/image' === props.name ) {
			defaultBlockName = 'image';
		}

		const newAttrs = Object.assign( {}, attributes );

		Object.keys( globalAttrs ).forEach( ( attribute ) => {
			let hasValue = !! attributes[ attribute ] || 0 === attributes[ attribute ];

			if ( Array.isArray( attributes[ attribute ] ) ) {
				hasValue = attributes[ attribute ].length > 0;
			}

			if ( ! noStyleAttributes.includes( attribute ) && ( ! hasValue || attributes[ attribute ] === generateBlocksDefaults[ defaultBlockName ][ attribute ] ) ) {
				newAttrs[ attribute ] = globalAttrs[ attribute ];
			}
		} );

		return newAttrs;
	}

	return attributes;
}

addFilter(
	'generateblocks.editor.cssAttrs',
	'generateblocks-pro/global-styles/filter-css',
	filterCSS
);

addFilter(
	'blocks.registerBlockType',
	'generateblocks-pro/global-styles/add-attributes',
	addAttributes
);

addFilter(
	'generateblocks.editor.controls',
	'generateblocks-pro/global-styles/add-controls',
	addControls,
	20
);

addFilter(
	'generateblocks.frontend.htmlAttributes',
	'generateblocks-pro/global-styles/add-attributes',
	addCustomAttributes
);
