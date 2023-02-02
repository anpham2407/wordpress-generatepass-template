<?php
/**
 * The class for related parent.
 *
 * @package Generateblocks/Extend/QueryLoop
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * The class for related parent.
 *
 * @since 1.3.0
 */
class GenerateBlocks_Pro_Related_Parent extends GenerateBlocks_Pro_Singleton {

	/**
	 * The class constructor.
	 */
	public function __construct() {
		parent::__construct();

		add_filter( 'generateblocks_query_loop_args', 'GenerateBlocks_Pro_Related_Parent::include_current_post' );
		add_filter( 'generateblocks_query_loop_args', 'GenerateBlocks_Pro_Related_Parent::exclude_current_post' );
	}

	/**
	 * Include current post as parent to the query loop.
	 *
	 * @since 1.3.0
	 * @param array $query_args The query arguments.
	 *
	 * @return array The query arguments.
	 */
	public static function include_current_post( $query_args ) {
		return self::add_current_post( $query_args, 'post_parent__in' );
	}

	/**
	 * Exclude current post as parent to the query loop.
	 *
	 * @since 1.3.0
	 * @param array $query_args The query arguments.
	 *
	 * @return array The query arguments.
	 */
	public static function exclude_current_post( $query_args ) {
		return self::add_current_post( $query_args, 'post_parent__not_in' );
	}

	/**
	 * Include current post to a query argument.
	 *
	 * @since 1.3.0
	 * @param array  $query_args The query arguments.
	 * @param string $key The query argument key.
	 *
	 * @return array The query arguments.
	 */
	protected static function add_current_post( $query_args, $key ) {
		if (
			isset( $query_args[ $key ] ) &&
			in_array( 'current-post', $query_args[ $key ] ) &&
			get_post_type() === $query_args['post_type']
		) {
			$current_post_index = array_search( 'current-post', $query_args[ $key ] );
			array_splice( $query_args[ $key ], $current_post_index, 1 );

			if ( ! in_array( get_the_ID(), $query_args[ $key ] ) ) {
				$query_args[ $key ][] = get_the_ID();
			}
		}

		return $query_args;
	}
}

GenerateBlocks_Pro_Related_Parent::get_instance();
