<?php
/**
 * The class to integrate advance custom fields to dynamic content post meta.
 *
 * @package Generateblocks/Extend/DynamicContent
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * GenerateBlocks Pro Advanced custom fields integration
 *
 * @since 1.4.0
 */
class GenerateBlocks_Pro_Advanced_Custom_Fields extends GenerateBlocks_Pro_Singleton {

	/**
	 * The class constructor.
	 */
	protected function __construct() {
		parent::__construct();

		if ( class_exists( 'ACF' ) ) {
			add_filter(
				'generateblocks_dynamic_content_post_meta',
				'GenerateBlocks_Pro_Advanced_Custom_Fields::load_acf_fields',
				10,
				3
			);

			add_filter(
				'generateblocks_dynamic_url_post_meta',
				'GenerateBlocks_Pro_Advanced_Custom_Fields::load_link_acf_fields',
				10,
				3
			);

			add_filter(
				'generateblocks_dynamic_content_author_meta',
				'GenerateBlocks_Pro_Advanced_Custom_Fields::load_author_acf_fields',
				10,
				3
			);

			add_filter(
				'generateblocks_dynamic_url_author_meta',
				'GenerateBlocks_Pro_Advanced_Custom_Fields::load_author_link_acf_fields',
				10,
				3
			);
		}
	}

	/**
	 * Load ACF fields in the frontend.
	 *
	 * @param mixed      $value The field value.
	 * @param string|int $id The object id.
	 * @param array      $attributes The block attributes.
	 * @param string     $metaFieldKey The meta field key.
	 * @param string     $metaFieldPropertyNameKey The property key.
	 *
	 * @return mixed|string The field value.
	 */
	public static function load_acf_fields(
		$value,
		$id,
		$attributes,
		$metaFieldKey = 'metaFieldName',
		$metaFieldPropertyNameKey = 'metaFieldPropertyName'
	) {
		$field = get_field( $attributes[ $metaFieldKey ], $id );

		if (
			is_array( $field ) &&
			isset( $attributes[ $metaFieldPropertyNameKey ] ) &&
			isset( $field[ $attributes[ $metaFieldPropertyNameKey ] ] )
		) {
			return $field[ $attributes[ $metaFieldPropertyNameKey ] ];
		} elseif ( is_array( $field ) ) {
			return '';
		}

		if (
			is_object( $field ) &&
			isset( $attributes[ $metaFieldPropertyNameKey ] ) &&
			isset( $field->{$attributes[ $metaFieldPropertyNameKey ]} )
		) {
			return $field->{$attributes[ $metaFieldPropertyNameKey ]};
		} elseif ( is_object( $field ) ) {
			return '';
		}

		return $field;
	}

	/**
	 * Load the author custom fields.
	 *
	 * @param mixed  $value The field value.
	 * @param string $author_id The author id.
	 * @param array  $attributes The block attributes.
	 *
	 * @return mixed|string The field value.
	 */
	public static function load_author_acf_fields( $value, $author_id, $attributes ) {
		return self::load_acf_fields( $value, 'user_' . $author_id, $attributes );
	}

	/**
	 * Load the link custom field.
	 *
	 * @param mixed  $value The field value.
	 * @param string $id The object id.
	 * @param array  $attributes The block attributes.
	 *
	 * @return mixed|string The field value.
	 */
	public static function load_link_acf_fields( $value, $id, $attributes ) {
		return self::load_acf_fields(
			$value,
			$id,
			$attributes,
			'linkMetaFieldName',
			'linkMetaFieldPropertyName'
		);
	}

	/**
	 * Load the author link custom field.
	 *
	 * @param mixed  $value The field value.
	 * @param string $author_id The author id.
	 * @param array  $attributes The block attributes.
	 *
	 * @return mixed|string The field value.
	 */
	public static function load_author_link_acf_fields( $value, $author_id, $attributes ) {
		return self::load_acf_fields(
			$value,
			'user_' . $author_id,
			$attributes,
			'linkMetaFieldName',
			'linkMetaFieldPropertyName'
		);
	}
}

GenerateBlocks_Pro_Advanced_Custom_Fields::get_instance();
