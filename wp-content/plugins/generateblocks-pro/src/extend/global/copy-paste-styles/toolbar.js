import CopyPasteStyles from './copy-paste';
/**
 * WordPress Dependencies
 */

import {
	addFilter,
} from '@wordpress/hooks';

import {
	Fragment,
} from '@wordpress/element';

import {
	BlockControls,
} from '@wordpress/block-editor';

import {
	createHigherOrderComponent,
} from '@wordpress/compose';

const allowedBlocks = [
	'generateblocks/container',
	'generateblocks/button',
	'generateblocks/headline',
	'generateblocks/button-container',
	'generateblocks/image',
];

/**
 * Add controls to the Container block toolbar.
 *
 * @param {Function} BlockEdit Block edit component.
 * @return {Function} BlockEdit Modified block edit component.
 */
const withAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const {
			name,
			setAttributes,
		} = props;

		return (
			<Fragment>
				<BlockEdit { ...props } />

				{ allowedBlocks.includes( name ) &&
					<Fragment>
						<BlockControls>
							<CopyPasteStyles
								{ ...props }
								onPaste={ ( value ) => setAttributes( value ) }
							/>
						</BlockControls>
					</Fragment>
				}
			</Fragment>
		);
	};
}, 'withAdvancedControls' );

addFilter(
	'editor.BlockEdit',
	'generateblocks-pro/copy-paste-styles/toolbar',
	withAdvancedControls
);
