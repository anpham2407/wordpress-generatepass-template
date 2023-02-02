<?php
/**
 * Handle post types in GenerateBlocks Pro.
 *
 * @package GenerateBlocks Pro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * The Local templates class.
 */
class GenerateBlocks_Pro_Local_Templates {
	/**
	 * Instance.
	 *
	 * @access private
	 * @var object Instance
	 */
	private static $instance;

	/**
	 * Initiator.
	 *
	 * @return object initialized object of class.
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Initiate class.
	 */
	public function __construct() {
		$admin_settings = wp_parse_args(
			get_option( 'generateblocks_admin', array() ),
			generateblocks_pro_get_admin_option_defaults()
		);

		if ( ! $admin_settings['enable_local_templates'] ) {
			return;
		}

		add_action( 'init', array( $this, 'add_custom_post_types' ) );
		add_action( 'generateblocks_dashboard_tabs', array( $this, 'add_tab' ) );
		add_filter( 'generateblocks_dashboard_screens', array( $this, 'add_to_dashboard_pages' ) );
	}

	/**
	 * Register custom post type.
	 */
	public function add_custom_post_types() {
		register_post_type(
			'gblocks_templates',
			array(
				'labels' => array(
					'name'                => _x( 'Local Patterns', 'Post Type General Name', 'generateblocks-pro' ),
					'singular_name'       => _x( 'Local Pattern', 'Post Type Singular Name', 'generateblocks-pro' ),
					'menu_name'           => __( 'Local Patterns', 'generateblocks-pro' ),
					'parent_item_colon'   => __( 'Parent Local Pattern', 'generateblocks-pro' ),
					'all_items'           => __( 'Local Patterns', 'generateblocks-pro' ),
					'view_item'           => __( 'View Local Pattern', 'generateblocks-pro' ),
					'add_new_item'        => __( 'Add New Local Pattern', 'generateblocks-pro' ),
					'add_new'             => __( 'Add New', 'generateblocks-pro' ),
					'edit_item'           => __( 'Edit Local Pattern', 'generateblocks-pro' ),
					'update_item'         => __( 'Update Local Pattern', 'generateblocks-pro' ),
					'search_items'        => __( 'Search Local Pattern', 'generateblocks-pro' ),
					'not_found'           => __( 'Not Found', 'generateblocks-pro' ),
					'not_found_in_trash'  => __( 'Not found in Trash', 'generateblocks-pro' ),
				),
				'public'              => false,
				'publicly_queryable'  => false,
				'has_archive'         => false,
				'show_ui'             => true,
				'exclude_from_search' => true,
				'show_in_nav_menus'   => false,
				'rewrite'             => false,
				'hierarchical'        => false,
				'show_in_menu'        => 'generateblocks',
				'show_in_admin_bar'   => true,
				'show_in_rest'        => true,
				'capabilities' => array(
					'publish_posts' => 'manage_options',
					'edit_posts' => 'manage_options',
					'edit_others_posts' => 'manage_options',
					'delete_posts' => 'manage_options',
					'delete_others_posts' => 'manage_options',
					'read_private_posts' => 'manage_options',
					'edit_post' => 'manage_options',
					'delete_post' => 'manage_options',
					'read_post' => 'manage_options',
				),
				'supports'            => array(
					'title',
					'editor',
					'thumbnail',
				),
			)
		);
	}

	/**
	 * Add a Local Templates tab to the GB Dashboard tabs.
	 *
	 * @param array $tabs The existing tabs.
	 */
	public function add_tab( $tabs ) {
		$screen = get_current_screen();

		$tabs['local-templates'] = array(
			'name' => __( 'Local Patterns', 'generateblocks-pro' ),
			'url' => admin_url( 'edit.php?post_type=gblocks_templates' ),
			'class' => 'edit-gblocks_templates' === $screen->id ? 'active' : '',
		);

		return $tabs;
	}

	/**
	 * Add to our Dashboard pages.
	 *
	 * @since 1.0.0
	 * @param array $pages The existing pages.
	 */
	public function add_to_dashboard_pages( $pages ) {
		$pages[] = 'edit-gblocks_templates';

		return $pages;
	}
}

GenerateBlocks_Pro_Local_Templates::get_instance();
