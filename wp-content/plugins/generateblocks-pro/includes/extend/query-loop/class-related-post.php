<?php
/**
 * The class for related post.
 *
 * @package Generateblocks/Extend/QueryLoop
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * The related posts class.
 *
 * @since 1.3.0
 */
class GenerateBlocks_Pro_Related_Post extends GenerateBlocks_Pro_Singleton {

	/**
	 * The class constructor.
	 */
	public function __construct() {
		parent::__construct();

		add_filter( 'generateblocks_query_loop_args', 'GenerateBlocks_Pro_Related_Post::exclude_current_post' );
	}

	/**
	 * Exclude current post from the query loop.
	 *
	 * @since 1.3.0
	 * @param Array $query_args The query arguments.
	 *
	 * @return Array The query arguments without current post.
	 */
	public static function exclude_current_post( $query_args ) {
		if (
			isset( $query_args['post__not_in'] ) &&
			in_array( 'exclude-current', $query_args['post__not_in'] ) &&
			get_post_type() === $query_args['post_type']
		) {
			if ( ! in_array( get_the_ID(), $query_args['post__not_in'] ) ) {
				$query_args['post__not_in'][] = get_the_ID();
			}

			$exclude_current_index = array_search( 'exclude-current', $query_args['post__not_in'] );
			array_splice( $query_args['post__not_in'], $exclude_current_index, 1 );

			// This is to avoid current post being dynamically added to post__in which will show him in the result set.
			if (
				isset( $query_args['post__in'] ) &&
				in_array( get_the_ID(), $query_args['post__in'] )
			) {
				$current_post_index = array_search( get_the_ID(), $query_args['post__in'] );
				array_splice( $query_args['post__in'], $current_post_index, 1 );
			}
		}

		return $query_args;
	}
}

GenerateBlocks_Pro_Related_Post::get_instance();
