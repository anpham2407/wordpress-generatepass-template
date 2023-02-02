import noStyleAttributes from '../../../utils/no-style-attributes';
import { __ } from '@wordpress/i18n';
import { ToolbarGroup } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import getIcon from '../../../utils/get-icon';

const {
	localStorage,
} = window;

const POPOVER_PROPS = {
	className: 'block-editor-block-settings-menu__popover',
	position: 'bottom right',
};

export default function BlockStyles( props ) {
	const {
		onPaste,
		attributes,
		name,
	} = props;

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );
	const { getBlockAttributes, getMultiSelectedBlockClientIds, hasMultiSelection } = useSelect( 'core/block-editor' );

	let blockName = '';

	if ( 'generateblocks/container' === name ) {
		blockName = 'Container';
	} else if ( 'generateblocks/button' === name ) {
		blockName = 'Button';
	} else if ( 'generateblocks/headline' === name ) {
		blockName = 'Headline';
	} else if ( 'generateblocks/container' === name ) {
		blockName = 'ButtonContainer';
	} else if ( 'generateblocks/image' === name ) {
		blockName = 'Image';
	}

	const copiedStyles = JSON.parse( localStorage.getItem( 'generateblocks' + blockName + 'Style' ) );

	const copyAction = () => {
		const copyStyles = {};

		Object.keys( attributes ).forEach( ( attribute ) => {
			if ( ! noStyleAttributes.includes( attribute ) ) {
				copyStyles[ attribute ] = attributes[ attribute ];
			}
		} );

		localStorage.setItem( 'generateblocks' + blockName + 'Style', JSON.stringify( copyStyles ) );
	};

	const pasteAction = () => {
		const pasteItem = JSON.parse( localStorage.getItem( 'generateblocks' + blockName + 'Style' ) );

		if ( pasteItem ) {
			onPaste( pasteItem );
		}
	};

	const clearAction = () => {
		// eslint-disable-next-line no-alert
		if ( window.confirm(
			hasMultiSelection()
				? __( 'This will remove all styling from these blocks.', 'generateblocks-pro' )
				: __( 'This will remove all styling from this block.', 'generateblocks-pro' )
		) ) {
			const clientIds = hasMultiSelection()
				? getMultiSelectedBlockClientIds()
				: [ props.clientId ];

			const newAttributes = {};

			clientIds.forEach( ( clientId ) => {
				const blockAttributes = getBlockAttributes( clientId );

				// Create an object of attributes we don't want to clear.
				const preservedAttributes = {};

				Object.keys( blockAttributes ).forEach( ( attribute ) => {
					if ( noStyleAttributes.includes( attribute ) ) {
						preservedAttributes[ attribute ] = blockAttributes[ attribute ];
					}
				} );

				// Create a fresh block with our preserved attributes.
				const freshBlock = createBlock(
					name,
					preservedAttributes
				);

				newAttributes[ clientId ] = freshBlock?.attributes;
			} );

			updateBlockAttributes( clientIds, newAttributes, true );
		}
	};

	return (
		<ToolbarGroup
			isCollapsed={ true }
			icon={ getIcon( 'copy' ) }
			label={ __( 'Styles', 'generateblocks-pro' ) }
			popoverProps={ POPOVER_PROPS }
			controls={
				[
					{
						title: __( 'Copy Styles', 'generateblocks-pro' ),
						onClick: copyAction,
						isDisabled: hasMultiSelection(),
					},
					{
						title: __( 'Paste Styles', 'generateblocks-pro' ),
						onClick: pasteAction,
						isDisabled: ! copiedStyles,
					},
					{
						title: __( 'Clear Styles', 'generateblocks-pro' ),
						onClick: clearAction,
					},
				]
			}
		/>
	);
}
