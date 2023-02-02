<?php
/**
 * The class for related terms.
 *
 * @package Generateblocks/Extend/QueryLoop
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * The class for related terms.
 *
 * @since 1.3.0
 */
class GenerateBlocks_Pro_Related_Terms extends GenerateBlocks_Pro_Singleton {

	/**
	 * The class constructor.
	 */
	public function __construct() {
		parent::__construct();

		add_filter( 'generateblocks_query_loop_args', 'GenerateBlocks_Pro_Related_Terms::include_current_post_terms' );
		add_filter( 'generateblocks_query_loop_args', 'GenerateBlocks_Pro_Related_Terms::exclude_current_post_terms' );
	}

	/**
	 * Include current post terms to the query loop.
	 *
	 * @since 1.3.0
	 * @param Array $query_args The query arguments.
	 *
	 * @return Array The query arguments with current post terms.
	 */
	public static function include_current_post_terms( $query_args ) {
		return self::add_current_post_terms( $query_args, 'tax_query' );
	}

	/**
	 * Exclude current post terms to the query loop.
	 *
	 * @since 1.3.0
	 * @param array $query_args The query arguments.
	 *
	 * @return array The query arguments without current post terms.
	 */
	public static function exclude_current_post_terms( $query_args ) {
		return self::add_current_post_terms( $query_args, 'tax_query_exclude' );
	}

	/**
	 * Include current post term to a query argument.
	 *
	 * @since 1.3.0
	 * @param array  $query_args The query arguments.
	 * @param string $key The query argument key.
	 *
	 * @return array The query arguments.
	 */
	protected static function add_current_post_terms( $query_args, $key ) {
		if (
			is_singular() &&
			isset( $query_args[ $key ] )
		) {
			$query_args[ $key ] = array_map(
				function( $tax ) {
					if ( in_array( 'current-terms', $tax['terms'] ) ) {
						$registered_taxonomies = get_object_taxonomies( get_post_type() );

						if ( in_array( $tax['taxonomy'], $registered_taxonomies ) ) {
							$related_terms = wp_get_object_terms(
								get_the_ID(),
								$tax['taxonomy'],
								array( 'fields' => 'ids' )
							);

							$tax['terms'] = array_merge( $tax['terms'], $related_terms );
						}

						$current_terms_index = array_search( 'current-terms', $tax['terms'] );
						array_splice( $tax['terms'], $current_terms_index, 1 );
					}

					return $tax;
				},
				$query_args[ $key ]
			);
		}

		return $query_args;
	}
}

GenerateBlocks_Pro_Related_Terms::get_instance();
