<?php
/**
 * General actions and filters.
 *
 * @package GenerateBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Build our settings area.
 *
 * @since 1.0
 */
class GenerateBlocks_Asset_Library {
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
	 * Initiate our class.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_menu' ) );
		add_action( 'generateblocks_dashboard_tabs', array( $this, 'add_tab' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_filter( 'generateblocks_dashboard_screens', array( $this, 'add_to_dashboard_pages' ) );
		add_action( 'generateblocks_asset_library_area', array( $this, 'add_shape_library' ), 5 );
		add_action( 'generateblocks_asset_library_area', array( $this, 'add_icon_library' ), 5 );
	}

	/**
	 * Add our Dashboard menu item.
	 */
	public function add_menu() {
		$settings = add_submenu_page(
			'generateblocks',
			__( 'Asset Library', 'generateblocks-pro' ),
			__( 'Asset Library', 'generateblocks-pro' ),
			'manage_options',
			'generateblocks-asset-library',
			array( $this, 'asset_library' ),
			5
		);
	}

	/**
	 * Add a Local Templates tab to the GB Dashboard tabs.
	 *
	 * @param array $tabs The existing tabs.
	 */
	public function add_tab( $tabs ) {
		$screen = get_current_screen();

		$tabs['asset-library'] = array(
			'name' => __( 'Asset Library', 'generateblocks-pro' ),
			'url' => admin_url( 'admin.php?page=generateblocks-asset-library' ),
			'class' => 'generateblocks_page_generateblocks-asset-library' === $screen->id ? 'active' : '',
		);

		return $tabs;
	}

	/**
	 * Enqueue our scripts.
	 */
	public function enqueue_scripts() {
		$screen = get_current_screen();

		if ( 'generateblocks_page_generateblocks-asset-library' === $screen->id ) {
			wp_enqueue_media();

			wp_enqueue_script(
				'generateblocks-pro-asset-library',
				GENERATEBLOCKS_PRO_DIR_URL . 'dist/asset-library.js',
				array( 'wp-api', 'wp-i18n', 'wp-components', 'wp-element', 'wp-api-fetch' ),
				GENERATEBLOCKS_PRO_VERSION,
				true
			);

			wp_set_script_translations( 'generateblocks-pro-asset-library', 'generateblocks-pro', GENERATEBLOCKS_PRO_DIR . 'languages' );

			wp_localize_script(
				'generateblocks-pro-asset-library',
				'generateBlocksProSettings',
				array(
					'shapes' => get_option( 'generateblocks_svg_shapes', array() ),
					'icons' => get_option( 'generateblocks_svg_icons', array() ),
					'hasSVGSupport' => generateblocks_pro_has_svg_support(),
				)
			);

			wp_enqueue_style(
				'generateblocks-pro-asset-library',
				GENERATEBLOCKS_PRO_DIR_URL . 'dist/asset-library.css',
				array( 'wp-components' ),
				GENERATEBLOCKS_PRO_VERSION
			);
		}
	}

	/**
	 * Add to our Dashboard pages.
	 *
	 * @since 1.0.0
	 * @param array $pages The existing pages.
	 */
	public function add_to_dashboard_pages( $pages ) {
		$pages[] = 'generateblocks_page_generateblocks-asset-library';

		return $pages;
	}

	/**
	 * Output our Dashboard HTML.
	 *
	 * @since 1.0.0
	 */
	public function asset_library() {
		?>
			<div class="wrap gblocks-dashboard-wrap">
				<div class="generateblocks-settings-area generateblocks-asset-library-area">
					<?php do_action( 'generateblocks_asset_library_area' ); ?>
				</div>
			</div>
		<?php
	}

	/**
	 * Add Shape Library container.
	 *
	 * @since 1.0.0
	 */
	public function add_shape_library() {
		echo '<div id="gblocks-shape-library"></div>';
	}

	/**
	 * Add Icon Library container.
	 *
	 * @since 1.0.0
	 */
	public function add_icon_library() {
		echo '<div id="gblocks-icon-library"></div>';
	}
}

GenerateBlocks_Asset_Library::get_instance();
