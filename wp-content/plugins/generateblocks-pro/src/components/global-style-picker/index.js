/**
 * Internal dependencies
 */
import './editor.scss';
import getIcon from '../../utils/get-icon';
import noStyleAttributes from '../../utils/no-style-attributes';

/**
 * WordPress dependencies
 */
import {
	__,
} from '@wordpress/i18n';

import {
	useState,
	useEffect,
	Fragment,
} from '@wordpress/element';

import {
	BaseControl,
	ToggleControl,
	TextControl,
	PanelBody,
	SelectControl,
	Button,
	Tooltip,
} from '@wordpress/components';

import { useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

export default function GlobalStylePicker( props ) {
	const {
		name,
		attributes,
		setAttributes,
		options,
		clientId,
	} = props;

	const {
		uniqueId,
		useGlobalStyle,
		globalStyleId,
		globalStyleLabel,
	} = attributes;

	const [ globalStyleLocked, setGlobalStyleLocked ] = useState( true );

	useEffect( () => {
		if ( generateBlocksPro.isGlobalStyle && ! attributes.isGlobalStyle ) {
			setAttributes( {
				isGlobalStyle: true,
			} );

			setGlobalStyleLocked( true );
		}

		if ( ! generateBlocksPro.isGlobalStyle && attributes.isGlobalStyle ) {
			setAttributes( {
				isGlobalStyle: false,
			} );
		}
	}, [] );

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );

	let idPrefix = '';
	let defaultStyles = {};

	if ( 'generateblocks/button' === name ) {
		idPrefix = 'gb-button-';

		defaultStyles = {
			backgroundColor: generateBlocksStyling.button.backgroundColor,
			textColor: generateBlocksStyling.button.textColor,
			backgroundColorHover: generateBlocksStyling.button.backgroundColorHover,
			textColorHover: generateBlocksStyling.button.textColorHover,
			paddingTop: generateBlocksStyling.button.paddingTop,
			paddingRight: generateBlocksStyling.button.paddingRight,
			paddingBottom: generateBlocksStyling.button.paddingBottom,
			paddingLeft: generateBlocksStyling.button.paddingLeft,
		};
	}

	if ( 'generateblocks/container' === name ) {
		idPrefix = 'gb-container-';
	}

	if ( 'generateblocks/headline' === name ) {
		idPrefix = 'gb-headline-';
	}

	if ( 'generateblocks/button-container' === name ) {
		idPrefix = 'gb-button-wrapper-';
	}

	if ( 'generateblocks/grid' === name ) {
		idPrefix = 'gb-grid-wrapper-';
	}

	if ( 'generateblocks/image' === name ) {
		idPrefix = 'gb-image-';
	}

	const preservedAttributes = {};

	Object.keys( attributes ).forEach( ( attribute ) => {
		if ( noStyleAttributes.includes( attribute ) ) {
			preservedAttributes[ attribute ] = attributes[ attribute ];
		}
	} );

	const newBlock = createBlock(
		name,
		preservedAttributes
	);

	const localStyles = {};

	Object.keys( attributes ).forEach( ( attribute ) => {
		if ( ! noStyleAttributes.includes( attribute ) ) {
			localStyles[ attribute ] = attributes[ attribute ];
		}
	} );

	const hasLocalStyles = Object.keys( localStyles ).some( ( attributeName ) => localStyles[ attributeName ] !== newBlock.attributes[ attributeName ] );

	const clearLocalStyles = () => {
		// eslint-disable-next-line no-alert
		if ( window.confirm( __( 'This will remove all local styling from this block.', 'generateblocks-pro' ) ) ) {
			updateBlockAttributes(
				[ clientId ],
				newBlock?.attributes
			);
		}
	};

	return (
		<Fragment>
			{ !! generateBlocksPro.isGlobalStyle &&
				<PanelBody
					title={ __( 'Global Style', 'generateblocks-pro' ) }
					initialOpen={ true }
					icon={ getIcon( 'globe' ) }
					className="gblocks-panel-label"
				>
					<BaseControl
						id="gblocks-global-style-id-field"
						help={ __( 'Name your global style something short and unique to this type of block.', 'generateblocks-pro' ) }
					>
						<div className="gblocks-global-style-id-field">
							<span className="gblocks-global-style-id-prefix">
								{ idPrefix }
							</span>

							<div className="gblocks-global-style-id-wrap">
								<TextControl
									type="text"
									disabled={ !! globalStyleLocked }
									value={ uniqueId }
									onChange={ ( value ) => {
										// No special characters allowed.
										value = value.replace( /[^\w]/gi, '-' );

										setAttributes( {
											uniqueId: value,
										} );
									} }
									onBlur={ () => setGlobalStyleLocked( true ) }
								/>

								{ !! globalStyleLocked &&
									<Tooltip text={ __( 'Change Global Style ID', 'generateblocks-pro' ) }>
										<Button
											icon={ getIcon( 'lock' ) }
											onClick={ () => {
												// eslint-disable-next-line
												if ( window.confirm( __( 'Changing this ID will remove the styling from existing blocks using this Global Style.', 'generateblocks-pro' ) ) ) {
													setGlobalStyleLocked( false );

													setTimeout( () => {
														document.querySelector( '.gblocks-global-style-id-wrap input' ).focus();
													}, 10 );
												}
											} }
										/>
									</Tooltip>
								}
							</div>
						</div>
					</BaseControl>

					<TextControl
						label={ __( 'Label', 'generateblocks-pro' ) }
						help={ __( 'The label shown when choosing a Global Style in the editor.', 'generateblocks-pro' ) }
						type="text"
						value={ globalStyleLabel || uniqueId }
						onChange={ ( value ) => {
							setAttributes( {
								globalStyleLabel: value,
							} );
						} }
					/>
				</PanelBody>
			}

			{ ! generateBlocksPro.isGlobalStyle &&
				<PanelBody>
					<ToggleControl
						className="gblocks-use-global-style"
						label={ __( 'Use Global Style', 'generateblocks-pro' ) }
						checked={ !! useGlobalStyle }
						onChange={ ( value ) => {
							setAttributes( {
								useGlobalStyle: value,
							} );
						} }
					/>

					{ !! useGlobalStyle &&
						<Fragment>
							<SelectControl
								className="gblocks-choose-global-style"
								value={ globalStyleId }
								options={ options }
								onChange={ ( value ) => {
									const newAttributes = {
										globalStyleId: value,
									};

									// Clear some common style values or add back their defaults.
									if ( Object.keys( defaultStyles ).length ) {
										Object.keys( defaultStyles ).forEach( ( style ) => {
											if ( '' === value ) {
												newAttributes[ style ] = defaultStyles[ style ];
											} else {
												newAttributes[ style ] = '';
											}
										} );
									}

									setAttributes( newAttributes );
								} }
							/>

							{ !! globalStyleId && !! hasLocalStyles &&
								<Button
									isSecondary
									isSmall
									onClick={ () => clearLocalStyles() }
								>
									{ __( 'Clear local styles', 'generateblocks-pro' ) }
								</Button>
							}
						</Fragment>
					}
				</PanelBody>
			}
		</Fragment>
	);
}
