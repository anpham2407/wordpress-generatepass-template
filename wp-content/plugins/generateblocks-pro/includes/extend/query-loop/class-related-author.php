<?php
/**
 * The class for related author.
 *
 * @package Generateblocks/Extend/QueryLoop
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * The class for related author.
 *
 * @since 1.3.0
 */
class GenerateBlocks_Pro_Related_Author extends GenerateBlocks_Pro_Singleton {

	/**
	 * The class constructor.
	 */
	public function __construct() {
		parent::__construct();

		add_filter( 'generateblocks_query_loop_args', 'GenerateBlocks_Pro_Related_Author::include_current_author' );
		add_filter( 'generateblocks_query_loop_args', 'GenerateBlocks_Pro_Related_Author::exclude_current_author' );
	}

	/**
	 * Include posts of current post author to the query loop.
	 *
	 * @since 1.3.0
	 * @param array $query_args The query arguments.
	 *
	 * @return array The query arguments.
	 */
	public static function include_current_author( $query_args ) {
		return self::add_current_author( $query_args, 'author__in' );
	}

	/**
	 * Exclude posts of current post author to the query loop.
	 *
	 * @since 1.3.0
	 * @param array $query_args The query arguments.
	 *
	 * @return array The query arguments.
	 */
	public static function exclude_current_author( $query_args ) {
		return self::add_current_author( $query_args, 'author__not_in' );
	}

	/**
	 * Include current author to a query argument.
	 *
	 * @since 1.3.0
	 * @param array  $query_args The query arguments.
	 * @param string $key The query argument key.
	 *
	 * @return array The query arguments.
	 */
	protected static function add_current_author( $query_args, $key ) {
		if (
			isset( $query_args[ $key ] ) &&
			in_array( 'current-post-author', $query_args[ $key ] )
		) {
			$current_post_author_index = array_search( 'current-post-author', $query_args[ $key ] );
			array_splice( $query_args[ $key ], $current_post_author_index, 1 );

			if ( ! in_array( get_the_author_meta( 'ID' ), $query_args[ $key ] ) ) {
				$query_args[ $key ][] = get_the_author_meta( 'ID' );
			}
		}

		return $query_args;
	}
}

GenerateBlocks_Pro_Related_Author::get_instance();
