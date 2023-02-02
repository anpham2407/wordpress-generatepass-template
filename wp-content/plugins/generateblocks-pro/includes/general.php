<?php
/**
 * General actions and filters.
 *
 * @package GenerateBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_action( 'enqueue_block_editor_assets', 'generateblocks_pro_do_block_editor_assets', 9 );
/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function generateblocks_pro_do_block_editor_assets() { // phpcs:ignore
	global $pagenow;

	$deps = array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-html-entities' );

	if ( 'widgets.php' === $pagenow ) {
		unset( $deps[3] );
	}

	$assets_file = GENERATEBLOCKS_PRO_DIR . 'dist/blocks.asset.php';
	$compiled_assets = file_exists( $assets_file )
		? require $assets_file
		: false;

	$assets =
		isset( $compiled_assets['dependencies'] ) &&
		isset( $compiled_assets['version'] )
		? $compiled_assets
		: array(
			'dependencies' => $deps,
			'version' => filemtime( GENERATEBLOCKS_PRO_DIR . 'dist/blocks.js' ),
		);

	wp_enqueue_script(
		'generateblocks-pro',
		GENERATEBLOCKS_PRO_DIR_URL . 'dist/blocks.js',
		$assets['dependencies'],
		$assets['version'],
		true
	);

	wp_set_script_translations( 'generateblocks-pro', 'generateblocks-pro', GENERATEBLOCKS_PRO_DIR . 'languages' );

	$admin_settings = wp_parse_args(
		get_option( 'generateblocks_admin', array() ),
		generateblocks_pro_get_admin_option_defaults()
	);

	wp_localize_script(
		'generateblocks-pro',
		'generateBlocksPro',
		array(
			'templatesURL' => admin_url( 'edit.php?post_type=gblocks_templates' ),
			'svgIcons' => generateblocks_pro_editor_icon_list(),
			'isGlobalStyle' => 'gblocks_global_style' === get_post_type(),
			'globalStyleIds' => generateblocks_pro_get_global_style_ids(),
			'globalStyleAttrs' => generateblocks_pro_get_global_style_attrs(),
			'hasRgbaSupport' => version_compare( GENERATEBLOCKS_VERSION, '1.4.0-alpha.1', '>=' ),
			'hasColorGroups' => version_compare( GENERATEBLOCKS_VERSION, '1.5.0-alpha.1', '>=' ),
			'enableRemoteTemplates' => $admin_settings['enable_remote_templates'],
			'enableLocalTemplates' => $admin_settings['enable_local_templates'],
			'isACFActive' => class_exists( 'ACF' ),
		)
	);

	wp_enqueue_style(
		'generateblocks-pro',
		GENERATEBLOCKS_PRO_DIR_URL . 'dist/blocks.css',
		array( 'wp-edit-blocks' ),
		filemtime( GENERATEBLOCKS_PRO_DIR . 'dist/blocks.css' )
	);
}

add_filter( 'generateblocks_attr_container', 'generateblocks_pro_set_container_attributes', 10, 2 );
/**
 * Set the attributes for our main Container wrapper.
 *
 * @since 1.0.0
 * @param array $attributes The existing attributes.
 * @param array $settings The settings for the block.
 */
function generateblocks_pro_set_container_attributes( $attributes, $settings ) {
	if ( '' !== $settings['url'] && 'wrapper' === $settings['linkType'] ) {
		$attributes['href'] = esc_url( $settings['url'] );

		$rel_attributes = array();

		if ( $settings['relNoFollow'] ) {
			$rel_attributes[] = 'nofollow';
		}

		if ( $settings['target'] ) {
			$rel_attributes[] = 'noopener';
			$rel_attributes[] = 'noreferrer';
			$attributes['target'] = '_blank';
		}

		if ( $settings['relSponsored'] ) {
			$rel_attributes[] = 'sponsored';
		}

		if ( ! empty( $rel_attributes ) ) {
			$attributes['rel'] = implode( ' ', $rel_attributes );
		}

		if ( $settings['hiddenLinkAriaLabel'] ) {
			$attributes['aria-label'] = esc_attr( $settings['hiddenLinkAriaLabel'] );
		}
	}

	$attributes = generateblocks_pro_with_custom_attributes( $attributes, $settings );

	if ( ! empty( $settings['useGlobalStyle'] ) && ! empty( $settings['globalStyleId'] ) ) {
		$attributes['class'] .= ' gb-container-' . esc_attr( $settings['globalStyleId'] );
	}

	return $attributes;
}

add_filter( 'generateblocks_attr_grid-item', 'generateblocks_pro_set_grid_container_attributes', 10, 2 );
/**
 * Set the attributes for our grid item wrapper.
 *
 * @since 1.1.0
 * @param array $attributes The existing attributes.
 * @param array $settings The settings for the block.
 */
function generateblocks_pro_set_grid_container_attributes( $attributes, $settings ) {
	if ( ! empty( $settings['useGlobalStyle'] ) && ! empty( $settings['globalStyleId'] ) ) {
		$attributes['class'] .= ' gb-grid-column-' . esc_attr( $settings['globalStyleId'] );
	}

	return $attributes;
}

add_filter( 'generateblocks_attr_grid-wrapper', 'generateblocks_pro_set_grid_attributes', 10, 2 );
/**
 * Set the attributes for our grid wrapper.
 *
 * @since 1.0.0
 * @param array $attributes The existing attributes.
 * @param array $settings The settings for the block.
 */
function generateblocks_pro_set_grid_attributes( $attributes, $settings ) {
	if ( ! empty( $settings['useGlobalStyle'] ) && ! empty( $settings['globalStyleId'] ) ) {
		$attributes['class'] .= ' gb-grid-wrapper-' . esc_attr( $settings['globalStyleId'] );
	}

	$attributes = generateblocks_pro_with_custom_attributes( $attributes, $settings );

	return $attributes;
}

add_filter( 'generateblocks_attr_button-container', 'generateblocks_pro_set_button_container_attributes', 10, 2 );
/**
 * Set the attributes for our grid wrapper.
 *
 * @since 1.0.0
 * @param array $attributes The existing attributes.
 * @param array $settings The settings for the block.
 */
function generateblocks_pro_set_button_container_attributes( $attributes, $settings ) {
	if ( ! empty( $settings['useGlobalStyle'] ) && ! empty( $settings['globalStyleId'] ) ) {
		$attributes['class'] .= ' gb-button-wrapper-' . esc_attr( $settings['globalStyleId'] );
	}

	$attributes = generateblocks_pro_with_custom_attributes( $attributes, $settings );

	return $attributes;
}

add_filter( 'generateblocks_attr_image', 'generateblocks_pro_set_image_attributes', 10, 2 );
/**
 * Set the attributes for our dynamic image block.
 *
 * @since 1.2.0
 * @param array $attributes The existing attributes.
 * @param array $settings The settings for the block.
 */
function generateblocks_pro_set_image_attributes( $attributes, $settings ) {
	if ( ! empty( $settings['useGlobalStyle'] ) && ! empty( $settings['globalStyleId'] ) ) {
		$attributes['class'] .= ' gb-image-' . esc_attr( $settings['globalStyleId'] );
	}

	$attributes = generateblocks_pro_with_custom_attributes( $attributes, $settings );

	return $attributes;
}

add_filter( 'generateblocks_attr_dynamic-headline', 'generateblocks_pro_set_headline_attributes', 10, 2 );
/**
 * Set the attributes for our dynamic headlines.
 *
 * @since 1.2.0
 * @param array $attributes The existing attributes.
 * @param array $settings The settings for the block.
 */
function generateblocks_pro_set_headline_attributes( $attributes, $settings ) {
	if ( ! empty( $settings['useGlobalStyle'] ) && ! empty( $settings['globalStyleId'] ) ) {
		$attributes['class'] .= ' gb-headline-' . esc_attr( $settings['globalStyleId'] );
	}

	$attributes = generateblocks_pro_with_custom_attributes( $attributes, $settings );

	return $attributes;
}

add_filter( 'generateblocks_attr_dynamic-button', 'generateblocks_pro_set_button_attributes', 10, 2 );
/**
 * Set the attributes for our dynamic buttons.
 *
 * @since 1.2.0
 * @param array $attributes The existing attributes.
 * @param array $settings The settings for the block.
 */
function generateblocks_pro_set_button_attributes( $attributes, $settings ) {
	if ( ! empty( $settings['useGlobalStyle'] ) && ! empty( $settings['globalStyleId'] ) ) {
		$attributes['class'] .= ' gb-button-' . esc_attr( $settings['globalStyleId'] );
	}

	$attributes = generateblocks_pro_with_custom_attributes( $attributes, $settings );

	return $attributes;
}

add_filter( 'generateblocks_after_container_open', 'generateblocks_pro_add_container_link', 10, 2 );
/**
 * Add a hidden container link to the Container.
 *
 * @since 1.0.0
 * @param string $output Block output.
 * @param array  $attributes The block attributes.
 */
function generateblocks_pro_add_container_link( $output, $attributes ) {
	$defaults = generateblocks_get_block_defaults();

	$settings = wp_parse_args(
		$attributes,
		$defaults['container']
	);

	if ( '' !== $settings['url'] && 'hidden-link' === $settings['linkType'] ) {
		$rel_attributes = array();

		if ( $settings['relNoFollow'] ) {
			$rel_attributes[] = 'nofollow';
		}

		if ( $settings['relSponsored'] ) {
			$rel_attributes[] = 'sponsored';
		}

		if ( ! empty( $rel_attributes ) ) {
			$attributes['rel'] = implode( ' ', $rel_attributes );
		}

		if ( $settings['target'] ) {
			$rel_attributes[] = 'noopener';
			$rel_attributes[] = 'noreferrer';
		}

		$output .= sprintf(
			'<a %s></a>',
			generateblocks_attr(
				'container-link',
				array(
					'class' => 'gb-container-link',
					'href' => '' !== $settings['url'] ? esc_url( $settings['url'] ) : '',
					'aria-label' => $settings['hiddenLinkAriaLabel'] ? esc_attr( $settings['hiddenLinkAriaLabel'] ) : '',
					'rel' => ! empty( $rel_attributes ) ? implode( ' ', $rel_attributes ) : '',
					'target' => $settings['target'] ? '_blank' : '',
				),
				$settings
			)
		);
	}

	return $output;
}

add_filter( 'generateblocks_svg_shapes', 'generateblocks_pro_add_custom_svg_shapes' );
/**
 * Add custom SVG shapes from our library.
 *
 * @since 1.0.0
 * @param array $shapes Existing shapes.
 */
function generateblocks_pro_add_custom_svg_shapes( $shapes ) {
	$custom_shapes = get_option( 'generateblocks_svg_shapes', array() );
	$new_shapes = array();

	if ( ! empty( $custom_shapes ) ) {
		// Format our custom shapes to fit our shapes structure.
		foreach ( $custom_shapes as $index => $data ) {
			$new_shapes[ esc_attr( $data['group_id'] ) ] = array(
				'group' => esc_html( $data['group'] ),
				'svgs' => array(),
			);

			if ( isset( $data['shapes'] ) ) {
				foreach ( (array) $data['shapes'] as $shape_index => $shape ) {
					$new_shapes[ esc_attr( $data['group_id'] ) ]['svgs'][ $shape['id'] ] = array(
						'label' => $shape['name'],
						'icon' => $shape['shape'],
					);
				}
			}
		}
	}

	$shapes = array_merge( $new_shapes, $shapes );

	return $shapes;
}

add_filter( 'generateblocks_container_tagname', 'generateblocks_pro_set_container_tagname', 10, 2 );
/**
 * Set the Container block tag name.
 *
 * @since 1.0.0
 *
 * @param string $tagname Current tag name.
 * @param array  $attributes Current attributes.
 */
function generateblocks_pro_set_container_tagname( $tagname, $attributes ) {
	$defaults = generateblocks_get_block_defaults();

	$settings = wp_parse_args(
		$attributes,
		$defaults['container']
	);

	if ( ! empty( $settings['url'] ) && 'wrapper' === $settings['linkType'] ) {
		$tagname = 'a';
	}

	return $tagname;
}
