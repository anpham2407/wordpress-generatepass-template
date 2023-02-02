<?php
/**
 * This file builds our dynamic CSS.
 *
 * @package GenerateBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_action( 'generateblocks_block_css_data', 'generateblocks_pro_generate_css', 10, 7 );
/**
 * Generate our CSS for our options.
 *
 * @since 1.0
 * @param string $name Name of the block.
 * @param array  $settings Our available settings.
 * @param object $css Current desktop CSS object.
 * @param object $desktop_css Current desktop-only CSS object.
 * @param object $tablet_css Current tablet CSS object.
 * @param object $tablet_only_css Current tablet-only CSS object.
 * @param object $mobile_css Current mobile CSS object.
 */
function generateblocks_pro_generate_css( $name, $settings, $css, $desktop_css, $tablet_css, $tablet_only_css, $mobile_css ) {
	if ( 'container' === $name ) {
		$css->set_selector( '.gb-container-' . $settings['uniqueId'] . ':hover' );
		$css->add_property( 'background-color', generateblocks_hex2rgba( $settings['backgroundColorHover'], $settings['backgroundColorHoverOpacity'] ) );
		$css->add_property( 'color', $settings['textColorHover'] );
		$css->add_property( 'border-color', generateblocks_hex2rgba( $settings['borderColorHover'], $settings['borderColorHoverOpacity'] ) );

		if (
			'hidden-link' === $settings['linkType'] &&
			(
				'' !== $settings['url'] ||
				(
					isset( $settings['dynamicLinkType'] ) &&
					'' !== $settings['dynamicLinkType']
				)
			)
		) {
			$css->set_selector( '.gb-container-' . $settings['uniqueId'] );
			if ( ! $settings['zindex'] ) {
				$css->add_property( 'position', 'relative' );
			}
		}

		// Backgrounds.
		if ( $settings['useAdvBackgrounds'] ) {
			$backgroundData = array();
			$hasPseudoBefore = false;
			$hasPseudoAfter = false;
			$innerZIndex = $settings['innerZindex'];
			$fallbackZIndex = false;
			$blockVersion = ! empty( $settings['blockVersion'] ) ? $settings['blockVersion'] : 1;

			if ( ! empty( $settings['advBackgrounds'] ) ) {
				foreach ( $settings['advBackgrounds'] as $key => $value ) {
					$backgroundSelector = generateblocks_pro_get_effect_selector( $settings['advBackgrounds'], $settings, '.gb-container-' . $settings['uniqueId'], $key );
					$element = $backgroundSelector['element'];
					$effectSelector = $backgroundSelector['selector'];

					if ( 'gradient' === $value['type'] ) {
						$gradientColorStopOneValue = '';
						$gradientColorStopTwoValue = '';
						$colorOneOpacity = isset( $value['colorOneOpacity'] ) ? $value['colorOneOpacity'] : 1;
						$colorTwoOpacity = isset( $value['colorTwoOpacity'] ) ? $value['colorTwoOpacity'] : 1;

						$gradientColorOneValue = generateblocks_hex2rgba( $value['colorOne'], $colorOneOpacity );
						$gradientColorTwoValue = generateblocks_hex2rgba( $value['colorTwo'], $colorTwoOpacity );

						if ( $value['colorOne'] && isset( $value['stopOne'] ) && '' !== $value['stopOne'] ) {
							$gradientColorStopOneValue = ' ' . $value['stopOne'] . '%';
						}

						if ( $value['colorTwo'] && isset( $value['stopTwo'] ) && '' !== $value['stopTwo'] ) {
							$gradientColorStopTwoValue = ' ' . $value['stopTwo'] . '%';
						}

						$gradient = 'linear-gradient(' . $value['direction'] . 'deg, ' . $gradientColorOneValue . $gradientColorStopOneValue . ', ' . $gradientColorTwoValue . $gradientColorStopTwoValue . ')';

						$backgroundData[ $element ]['selector'] = $effectSelector;
						$backgroundData[ $element ]['state'] = ! empty( $value['state'] ) ? $value['state'] : 'normal';
						$backgroundData[ $element ]['gradient'] = $gradient;
						$backgroundData[ $element ]['device'] = ! empty( $value['device'] ) ? $value['device'] : 'all';
						$backgroundData[ $element ]['target'] = ! empty( $value['target'] ) ? $value['target'] : 'self';
						$backgroundData[ $element ]['type'] = ! empty( $value['type'] ) ? $value['type'] : '';
					}

					if ( 'image' === $value['type'] ) {
						$backgroundData[ $element ]['selector'] = $effectSelector;
						$backgroundData[ $element ]['state'] = ! empty( $value['state'] ) ? $value['state'] : 'normal';
						$backgroundData[ $element ]['device'] = ! empty( $value['device'] ) ? $value['device'] : 'all';
						$backgroundData[ $element ]['target'] = ! empty( $value['target'] ) ? $value['target'] : 'self';
						$backgroundData[ $element ]['type'] = ! empty( $value['type'] ) ? $value['type'] : '';
						$backgroundData[ $element ]['url'] = $value['url'];
						$backgroundData[ $element ]['id'] = $value['id'];
						$backgroundData[ $element ]['imageSize'] = $value['imageSize'];
						$backgroundData[ $element ]['size'] = $value['size'];
						$backgroundData[ $element ]['position'] = $value['position'];
						$backgroundData[ $element ]['repeat'] = $value['repeat'];
						$backgroundData[ $element ]['attachment'] = $value['attachment'];
					}
				}

				foreach ( $backgroundData as $target => $data ) {
					$effect_css = $css;

					if ( ! empty( $data['device'] ) ) {
						if ( 'desktop' === $data['device'] ) {
							$effect_css = $desktop_css;
						}

						if ( 'tablet-only' === $data['device'] ) {
							$effect_css = $tablet_only_css;
						}

						if ( 'tablet' === $data['device'] ) {
							$effect_css = $tablet_css;
						}

						if ( 'mobile' === $data['device'] ) {
							$effect_css = $mobile_css;
						}
					}

					if ( 'gradient' === $data['type'] ) {
						if ( 'pseudo-element' === $data['target'] && ! $hasPseudoAfter ) {
							$effect_css->set_selector( $data['selector'] );
							$effect_css->add_property( 'content', '""' );
							$effect_css->add_property( 'z-index', '0' );
							$effect_css->add_property( 'position', 'absolute' );
							$effect_css->add_property( 'top', '0' );
							$effect_css->add_property( 'right', '0' );
							$effect_css->add_property( 'bottom', '0' );
							$effect_css->add_property( 'left', '0' );

							$effect_css->set_selector( '.gb-container-' . $settings['uniqueId'] );
							$effect_css->add_property( 'position', 'relative' );
							$effect_css->add_property( 'overflow', 'hidden' );

							if ( 'all' === $data['device'] ) {
								$hasPseudoAfter = true;
							}

							if ( $blockVersion < 2 && ! $innerZIndex ) {
								$fallbackZIndex = 1;
							}
						}

						$effect_css->set_selector( $data['selector'] );
						$effect_css->add_property( 'background-image', $data['gradient'] );
					}

					if ( 'image' === $data['type'] ) {
						$bgImageUrl = '';

						if ( isset( $data['id'] ) ) {
							$image_src = wp_get_attachment_image_src( $data['id'], $data['imageSize'] );

							if ( is_array( $image_src ) ) {
								$bgImageUrl = $image_src[0];
							} else {
								$bgImageUrl = $data['url'];
							}
						} else {
							$bgImageUrl = $data['url'];
						}

						$bgImageUrl = apply_filters( 'generateblocks_background_image_url', $bgImageUrl, $settings );

						if ( 'pseudo-element' === $data['target'] && ! $hasPseudoBefore ) {
							$effect_css->set_selector( $data['selector'] );
							$effect_css->add_property( 'content', '""' );
							$effect_css->add_property( 'z-index', '0' );
							$effect_css->add_property( 'position', 'absolute' );
							$effect_css->add_property( 'top', '0' );
							$effect_css->add_property( 'right', '0' );
							$effect_css->add_property( 'bottom', '0' );
							$effect_css->add_property( 'left', '0' );
							$effect_css->set_selector( '.gb-container-' . $settings['uniqueId'] );
							$effect_css->add_property( 'position', 'relative' );
							$effect_css->add_property( 'overflow', 'hidden' );

							if ( 'all' === $data['device'] || 'desktop' === $data['device'] ) {
								$effect_css->add_property( 'border-radius', generateblocks_get_shorthand_css( $settings['borderRadiusTopLeft'], $settings['borderRadiusTopRight'], $settings['borderRadiusBottomRight'], $settings['borderRadiusBottomLeft'], $settings['borderRadiusUnit'] ) );
							} elseif ( 'tablet' === $data['device'] ) {
								$effect_css->add_property( 'border-radius', array( $settings['borderRadiusTopLeftTablet'], $settings['borderRadiusTopRightTablet'], $settings['borderRadiusBottomRightTablet'], $settings['borderRadiusBottomLeftTablet'] ), $settings['borderRadiusUnit'] );
							} elseif ( 'mobile' === $data['device'] ) {
								$effect_css->add_property( 'border-radius', array( $settings['borderRadiusTopLeftMobile'], $settings['borderRadiusTopRightMobile'], $settings['borderRadiusBottomRightMobile'], $settings['borderRadiusBottomLeftMobile'] ), $settings['borderRadiusUnit'] );
							}

							if ( 'all' === $data['device'] ) {
								$hasPseudoBefore = true;
							}

							if ( $blockVersion < 2 && ! $innerZIndex ) {
								$fallbackZIndex = 1;
							}
						}

						$effect_css->set_selector( $data['selector'] );
						$effect_css->add_property( 'background-image', $bgImageUrl ? 'url(' . $bgImageUrl . ')' : '' );
						$effect_css->add_property( 'background-size', $data['size'] );
						$effect_css->add_property( 'background-position', $data['position'] );
						$effect_css->add_property( 'background-repeat', $data['repeat'] );
						$effect_css->add_property( 'background-attachment', $data['attachment'] );
					}
				}

				if ( $fallbackZIndex ) {
					$css->set_selector( '.gb-container-' . $settings['uniqueId'] . ' > .gb-inside-container' );
					$css->add_property( 'z-index', $fallbackZIndex );
					$css->add_property( 'position', 'relative' );
				}
			}
		}
	}

	// Add effects CSS for these blocks.
	if ( 'container' === $name || 'button' === $name || 'headline' === $name || 'image' === $name ) {
		$selector = '.gb-container-' . $settings['uniqueId'];

		if ( 'headline' === $name ) {
			$selector = '.gb-headline-' . $settings['uniqueId'];
		}

		if ( 'button' === $name ) {
			$selector = '.gb-button-wrapper .gb-button-' . $settings['uniqueId'];
		}

		if ( 'image' === $name ) {
			$selector = '.gb-image-' . $settings['uniqueId'];
		}

		// Box Shadows.
		$boxShadowData = array();

		if ( $settings['useBoxShadow'] && ! empty( $settings['boxShadows'] ) ) {
			foreach ( $settings['boxShadows'] as $key => $value ) {
				$boxShadowSelector = generateblocks_pro_get_effect_selector( $settings['boxShadows'], $settings, $selector, $key );

				$element = $boxShadowSelector['element'];
				$effectSelector = $boxShadowSelector['selector'];

				$boxShadowData[ $element ]['selector'] = $effectSelector;
				$boxShadowData[ $element ]['state'] = ! empty( $value['state'] ) ? $value['state'] : 'normal';
				$boxShadowData[ $element ]['device'] = ! empty( $value['device'] ) ? $value['device'] : 'all';
				$boxShadowColorOpacity = isset( $value['colorOpacity'] ) ? $value['colorOpacity'] : 1;

				$box_shadow = sprintf(
					'%1$s %2$s %3$s %4$s %5$s %6$s',
					$value['inset'] ? 'inset' : '',
					$value['xOffset'] ? $value['xOffset'] . 'px' : 0,
					$value['yOffset'] ? $value['yOffset'] . 'px' : 0,
					$value['blur'] ? $value['blur'] . 'px' : 0,
					$value['spread'] ? $value['spread'] . 'px' : 0,
					generateblocks_hex2rgba( $value['color'], $boxShadowColorOpacity )
				);

				$boxShadowData[ $element ]['boxShadow'] = $box_shadow;
			}

			foreach ( $boxShadowData as $target => $data ) {
				$effect_css = $css;

				if ( ! empty( $data['device'] ) ) {
					if ( 'desktop' === $data['device'] ) {
						$effect_css = $desktop_css;
					}

					if ( 'tablet-only' === $data['device'] ) {
						$effect_css = $tablet_only_css;
					}

					if ( 'tablet' === $data['device'] ) {
						$effect_css = $tablet_css;
					}

					if ( 'mobile' === $data['device'] ) {
						$effect_css = $mobile_css;
					}
				}

				$effect_css->set_selector( $data['selector'] );

				if ( ! empty( $data['boxShadow'] ) ) {
					$effect_css->add_property( 'box-shadow', $data['boxShadow'] );
				}
			}
		}

		if ( $settings['useTransform'] ) {
			// Transforms.
			$transformData = generateblocks_pro_get_transforms( $settings, $selector );

			foreach ( $transformData as $target => $data ) {
				$effect_css = $css;

				if ( ! empty( $data['device'] ) ) {
					if ( 'desktop' === $data['device'] ) {
						$effect_css = $desktop_css;
					}

					if ( 'tablet-only' === $data['device'] ) {
						$effect_css = $tablet_only_css;
					}

					if ( 'tablet' === $data['device'] ) {
						$effect_css = $tablet_css;
					}

					if ( 'mobile' === $data['device'] ) {
						$effect_css = $mobile_css;
					}
				}

				$effect_css->set_selector( $data['selector'] );

				if ( ! empty( $data['transforms'] ) ) {
					$effect_css->add_property( 'transform', implode( ' ', $data['transforms'] ) );
				}
			}
		}

		if ( $settings['useFilter'] ) {
			// Transforms.
			$filterData = generateblocks_pro_get_css_filters( $settings, $selector );

			foreach ( $filterData as $target => $data ) {
				$effect_css = $css;

				if ( ! empty( $data['device'] ) ) {
					if ( 'desktop' === $data['device'] ) {
						$effect_css = $desktop_css;
					}

					if ( 'tablet-only' === $data['device'] ) {
						$effect_css = $tablet_only_css;
					}

					if ( 'tablet' === $data['device'] ) {
						$effect_css = $tablet_css;
					}

					if ( 'mobile' === $data['device'] ) {
						$effect_css = $mobile_css;
					}
				}

				$effect_css->set_selector( $data['selector'] );

				if ( ! empty( $data['filters'] ) ) {
					$effect_css->add_property( 'filter', implode( ' ', $data['filters'] ) );
				}
			}
		}

		if ( $settings['useOpacity'] ) {
			// Opacities.
			$opacityData = array();

			if ( ! empty( $settings['opacities'] ) ) {
				foreach ( $settings['opacities'] as $key => $value ) {
					$opacitySelector = generateblocks_pro_get_effect_selector( $settings['opacities'], $settings, $selector, $key );

					$element = $opacitySelector['element'];
					$effectSelector = $opacitySelector['selector'];

					$opacityData[ $element ]['selector'] = $effectSelector;
					$opacityData[ $element ]['state'] = ! empty( $value['state'] ) ? $value['state'] : 'normal';
					$opacityData[ $element ]['opacity'] = $value['opacity'];
					$opacityData[ $element ]['mixBlendMode'] = ! empty( $value['mixBlendMode'] ) ? $value['mixBlendMode'] : '';
					$opacityData[ $element ]['device'] = ! empty( $value['device'] ) ? $value['device'] : 'all';
				}

				foreach ( $opacityData as $target => $data ) {
					$effect_css = $css;

					if ( ! empty( $data['device'] ) ) {
						if ( 'desktop' === $data['device'] ) {
							$effect_css = $desktop_css;
						}

						if ( 'tablet-only' === $data['device'] ) {
							$effect_css = $tablet_only_css;
						}

						if ( 'tablet' === $data['device'] ) {
							$effect_css = $tablet_css;
						}

						if ( 'mobile' === $data['device'] ) {
							$effect_css = $mobile_css;
						}
					}

					$effect_css->set_selector( $data['selector'] );

					if ( ! empty( $data['opacity'] ) || 0 === $data['opacity'] ) {
						$effect_css->add_property( 'opacity', $data['opacity'] || 0 === $data['opacity'] ? $data['opacity'] : '' );
					}

					if ( $data['mixBlendMode'] ) {
						$effect_css->add_property( 'mix-blend-mode', $data['mixBlendMode'] );
					}
				}
			}
		}

		// Transitions.
		if ( $settings['useTransition'] ) {
			$transitionData = array();

			if ( ! empty( $settings['transitions'] ) ) {
				foreach ( $settings['transitions'] as $key => $value ) {
					$transitionSelector = generateblocks_pro_get_effect_selector( $settings['transitions'], $settings, $selector, $key );

					$element = $transitionSelector['element'];
					$effectSelector = $transitionSelector['selector'];

					$transitionData[ $element ]['selector'] = $effectSelector;
					$transitionData[ $element ]['state'] = ! empty( $value['state'] ) ? $value['state'] : 'normal';
					$transitionData[ $element ]['device'] = ! empty( $value['device'] ) ? $value['device'] : 'all';

					$transitions = array(
						$value['property'] ? $value['property'] : 'all',
						$value['duration'] || 0 === $value['duration'] ? $value['duration'] . 's' : 0.5 . 's',
						$value['timingFunction'] ? $value['timingFunction'] : 'ease',
						$value['delay'] || 0 === $value['delay'] ? $value['delay'] . 's' : '',
					);

					$transitions = implode( ' ', $transitions );

					$transitionData[ $element ]['transitions'][] = $transitions;
				}

				foreach ( $transitionData as $target => $data ) {
					$effect_css = $css;

					if ( ! empty( $data['device'] ) ) {
						if ( 'desktop' === $data['device'] ) {
							$effect_css = $desktop_css;
						}

						if ( 'tablet-only' === $data['device'] ) {
							$effect_css = $tablet_only_css;
						}

						if ( 'tablet' === $data['device'] ) {
							$effect_css = $tablet_css;
						}

						if ( 'mobile' === $data['device'] ) {
							$effect_css = $mobile_css;
						}
					}

					$effect_css->set_selector( $data['selector'] );

					if ( ! empty( $data['transitions'] ) ) {
						$effect_css->add_property( 'transition', implode( ' ', $data['transitions'] ) );
					}
				}
			}
		}

		// Text Shadows.
		if ( $settings['useTextShadow'] ) {
			$textShadowData = array();

			if ( ! empty( $settings['textShadows'] ) ) {
				foreach ( $settings['textShadows'] as $key => $value ) {
					$textShadowSelector = generateblocks_pro_get_effect_selector( $settings['textShadows'], $settings, $selector, $key );

					$element = $textShadowSelector['element'];
					$effectSelector = $textShadowSelector['selector'];

					$textShadowData[ $element ]['selector'] = $effectSelector;
					$textShadowData[ $element ]['state'] = ! empty( $value['state'] ) ? $value['state'] : 'normal';
					$textShadowData[ $element ]['device'] = ! empty( $value['device'] ) ? $value['device'] : 'all';
					$textShadowColorOpacity = isset( $value['colorOpacity'] ) ? $value['colorOpacity'] : 1;

					$textShadowData[ $element ]['textShadow'] = sprintf(
						'%1$s %2$s %3$s %4$s',
						generateblocks_hex2rgba( $value['color'], $textShadowColorOpacity ),
						$value['xOffset'] ? $value['xOffset'] . 'px' : 0,
						$value['yOffset'] ? $value['yOffset'] . 'px' : 0,
						$value['blur'] ? $value['blur'] . 'px' : 0
					);
				}

				foreach ( $textShadowData as $target => $data ) {
					$effect_css = $css;

					if ( ! empty( $data['device'] ) ) {
						if ( 'desktop' === $data['device'] ) {
							$effect_css = $desktop_css;
						}

						if ( 'tablet-only' === $data['device'] ) {
							$effect_css = $tablet_only_css;
						}

						if ( 'tablet' === $data['device'] ) {
							$effect_css = $tablet_css;
						}

						if ( 'mobile' === $data['device'] ) {
							$effect_css = $mobile_css;
						}
					}

					$effect_css->set_selector( $data['selector'] );

					if ( ! empty( $data['textShadow'] ) ) {
						$effect_css->add_property( 'text-shadow', $data['textShadow'] );
					}
				}
			}
		}
	}

	/**
	 * Device visibility.
	 */

	if ( 'container' === $name || 'button-container' === $name || 'grid' === $name || 'button' === $name || 'headline' === $name || 'image' === $name ) {
		if ( 'container' === $name ) {
			$selector = '.gb-container-' . $settings['uniqueId'];

			if ( $settings['isGrid'] ) {
				$selector .= ', .gb-grid-column-' . $settings['uniqueId'];
			}
		} elseif ( 'button-container' === $name ) {
			$selector = '.gb-button-wrapper-' . $settings['uniqueId'];
		} elseif ( 'button' === $name ) {
			$selector = '.gb-button-wrapper .gb-button-' . $settings['uniqueId'];
		} elseif ( 'headline' === $name ) {
			$selector = $settings['element'] . '.gb-headline-' . $settings['uniqueId'];
		} elseif ( 'grid' === $name ) {
			$selector = '.gb-grid-wrapper-' . $settings['uniqueId'];
		} elseif ( 'image' === $name ) {
			$selector = '.gb-block-image-' . $settings['uniqueId'];
		}

		if ( $settings['hideOnDesktop'] ) {
			$desktop_css->set_selector( $selector );
			$desktop_css->add_property( 'display', 'none !important' );
		}

		if ( $settings['hideOnTablet'] ) {
			$tablet_only_css->set_selector( $selector );
			$tablet_only_css->add_property( 'display', 'none !important' );
		}

		if ( $settings['hideOnMobile'] ) {
			$mobile_css->set_selector( $selector );
			$mobile_css->add_property( 'display', 'none !important' );
		}
	}
}

add_filter( 'generateblocks_css_output', 'generateblocks_pro_one_time_css' );
/**
 * Add one-time CSS to the page.
 *
 * @param string $css The existing CSS on the page.
 */
function generateblocks_pro_one_time_css( $css ) {
	$css .= '.gb-container-link{position:absolute;top:0;right:0;bottom:0;left:0;z-index:99;}a.gb-container{display: block;}';

	return $css;
}
