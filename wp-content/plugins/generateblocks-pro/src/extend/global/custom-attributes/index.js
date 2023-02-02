import './editor.scss';
import DOMPurify from 'dompurify';
import getIcon from '../../../utils/get-icon';

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
	useState,
} from '@wordpress/element';

import {
	InspectorAdvancedControls,
} from '@wordpress/block-editor';

import {
	createHigherOrderComponent,
} from '@wordpress/compose';

import {
	Button,
	BaseControl,
	TextControl,
	Modal,
} from '@wordpress/components';

const allowedBlocks = [
	'generateblocks/container',
	'generateblocks/button',
	'generateblocks/headline',
	'generateblocks/button-container',
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

	if ( typeof settings.attributes !== 'undefined' ) {
		settings.attributes = Object.assign( settings.attributes, {
			htmlAttributes: {
				type: 'array',
				default: [],
			},
		} );
	}

	return settings;
}

/**
 * Add mobile visibility controls on Advanced Block Panel.
 *
 * @param {Function} BlockEdit Block edit component.
 * @return {Function} BlockEdit Modified block edit component.
 */
const withAdvancedControls = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			if ( props.isSelected && allowedBlocks.includes( props.name ) ) {
				const [ isOpen, setOpen ] = useState( false );
				const openModal = () => setOpen( true );
				const closeModal = () => setOpen( false );

				const {
					attributes,
					setAttributes,
				} = props;

				const handleAddLocation = () => {
					const htmlAttributes = [ ...attributes.htmlAttributes ];

					htmlAttributes.push( {
						attribute: '',
					} );

					setAttributes( { htmlAttributes } );
				};

				const handleRemoveLocation = ( index ) => {
					const htmlAttributes = [ ...attributes.htmlAttributes ];

					htmlAttributes.splice( index, 1 );
					setAttributes( { htmlAttributes } );
				};

				const handleLocationChange = ( value, index, type ) => {
					const htmlAttributes = [ ...attributes.htmlAttributes ];

					if ( 'name' === type ) {
						htmlAttributes[ index ] = {
							...htmlAttributes[ index ],
							attribute: DOMPurify.sanitize( value ),
						};
					}

					if ( 'value' === type ) {
						htmlAttributes[ index ] = {
							...htmlAttributes[ index ],
							value: DOMPurify.sanitize( value ),
						};
					}

					setAttributes( { htmlAttributes } );
				};

				return (
					<Fragment>
						<BlockEdit { ...props } />

						<InspectorAdvancedControls>
							<BaseControl
								id="gblocks-custom-attributes"
								className={ 'gblocks-custom-attributes-base-control' }
								label={ __( 'Custom Attributes', 'generateblocks-pro' ) }
							>
								{ attributes.htmlAttributes.map( ( location, index ) => {
									const disableValue = 'itemscope' === attributes.htmlAttributes[ index ].attribute || 'download' === attributes.htmlAttributes[ index ].attribute;

									return <Fragment key={ index }>
										<div className="gblocks-data-attributes">
											<TextControl
												className="gblocks-attribute-name"
												placeholder="data-attribute"
												value={ attributes.htmlAttributes[ index ].attribute }
												onChange={ ( value ) => handleLocationChange( value, index, 'name' ) }
												onBlur={ () => {
													const htmlAttributes = [ ...attributes.htmlAttributes ];
													const attr = htmlAttributes[ index ].attribute;

													if ( attr ) {
														htmlAttributes[ index ].attribute = sanitizeAttribute( attr );

														setAttributes( { htmlAttributes } );
													}
												} }
											/>

											<TextControl
												disabled={ disableValue }
												style={ { opacity: disableValue ? 0.2 : null } }
												className="gblocks-arribute-value"
												placeholder="value"
												value={ attributes.htmlAttributes[ index ].value }
												onChange={ ( value ) => handleLocationChange( value, index, 'value' ) }
											/>

											<Button
												className="gblocks-remove-attribute"
												icon={ getIcon( 'trash' ) }
												label={ __( 'Delete attribute', 'generateblocks-pro' ) }
												onClick={ () => handleRemoveLocation( index ) }
											/>
										</div>
									</Fragment>;
								} ) }

								<div className="gblocks-add-attribute-button-container">
									<Button
										isSecondary
										onClick={ handleAddLocation.bind( this ) }
									>
										{ __( 'Add Attribute', 'generateblocks-pro' ) }
									</Button>
								</div>

								<Button
									onClick={ openModal }
									isSmall
									isTertiary
									className="gblocks-custom-attributes-allowed-list"
									icon={ getIcon( 'question' ) }
								>
									{ __( 'Allowed attributes', 'generateblocks-pro' ) }
								</Button>

								{ isOpen && (
									<Modal title={ __( 'Allowed attributes', 'generateblocks-pro' ) } onRequestClose={ closeModal }>
										<p>
											{ __( 'The following HTML attributes are allowed to be used in the Custom Attributes feature:', 'generateblocks-pro' ) }
										</p>

										<ul>
											<li>data-*</li>
											<li>aria-*</li>
											<li>title</li>
											<li>download</li>
											<li>role</li>
											<li>itemtype</li>
											<li>itemscope</li>
											<li>itemprop</li>
										</ul>
										<Button isSecondary onClick={ closeModal }>
											{ __( 'Close', 'generateblocks-pro' ) }
										</Button>
									</Modal>
								) }
							</BaseControl>
						</InspectorAdvancedControls>
					</Fragment>
				);
			}

			return <BlockEdit { ...props } />;
		};
	},
	'withAdvancedControls'
);

function sanitizeAttribute( attribute ) {
	const safeValues = [
		'title',
		'role',
		'download',
		'itemtype',
		'itemscope',
		'itemprop',
	];

	let isValueSafe = false;

	if ( attribute.startsWith( 'data-' ) ) {
		isValueSafe = true;
	}

	if ( attribute.startsWith( 'aria-' ) ) {
		isValueSafe = true;
	}

	if ( safeValues.includes( attribute ) ) {
		isValueSafe = true;
	}

	if ( ! isValueSafe ) {
		attribute = '';
	}

	return attribute;
}

function addCustomAttributes( blockHtmlAttributes, blockName, blockAttributes ) {
	if ( ! allowedBlocks.includes( blockName ) ) {
		return blockHtmlAttributes;
	}

	if ( blockAttributes.htmlAttributes ) {
		Object.keys( blockAttributes.htmlAttributes ).forEach( function( keyName ) {
			const attributeName = sanitizeAttribute( blockAttributes.htmlAttributes[ keyName ].attribute );
			const attributeValue = blockAttributes.htmlAttributes[ keyName ].value;

			if ( attributeName ) {
				blockHtmlAttributes = Object.assign( blockHtmlAttributes, {
					[ attributeName ]: DOMPurify.sanitize( attributeValue ),
				} );
			}
		} );
	}

	return blockHtmlAttributes;
}

addFilter(
	'blocks.registerBlockType',
	'generateblocks-pro/custom-attributes/add-attributes',
	addAttributes
);

addFilter(
	'editor.BlockEdit',
	'generateblocks-pro/custom-attributes/add-control',
	withAdvancedControls
);

addFilter(
	'generateblocks.frontend.htmlAttributes',
	'generatebocks-pro/custom-attributes/add-custom-attributes',
	addCustomAttributes
);
