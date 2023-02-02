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
class GenerateBlocks_Pro_Settings {
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
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'generateblocks_settings_area', array( $this, 'add_license_key_area' ), 5 );
		add_action( 'generateblocks_settings_area', array( $this, 'add_template_library_settings' ), 20 );
	}

	/**
	 * Enqueue our scripts.
	 */
	public function enqueue_scripts() {
		$screen = get_current_screen();

		if ( 'generateblocks_page_generateblocks-settings' === $screen->id ) {
			wp_enqueue_script(
				'generateblocks-pro-settings',
				GENERATEBLOCKS_PRO_DIR_URL . 'dist/dashboard.js',
				array( 'generateblocks-settings', 'wp-api', 'wp-i18n', 'wp-components', 'wp-element', 'wp-api-fetch' ),
				GENERATEBLOCKS_PRO_VERSION,
				true
			);

			wp_set_script_translations( 'generateblocks-pro-settings', 'generateblocks-pro', GENERATEBLOCKS_PRO_DIR . 'languages' );

			wp_localize_script(
				'generateblocks-pro-settings',
				'generateBlocksProSettings',
				array(
					'settings' => wp_parse_args(
						get_option( 'generateblocks', array() ),
						generateblocks_get_option_defaults()
					),
					'adminSettings' => wp_parse_args(
						get_option( 'generateblocks_admin', array() ),
						generateblocks_pro_get_admin_option_defaults()
					),
					'licenseSettings' => wp_parse_args(
						get_option( 'generateblocks_pro_licensing', array() ),
						generateblocks_pro_get_license_defaults()
					),
				)
			);

			wp_enqueue_style(
				'generateblocks-pro-settings',
				GENERATEBLOCKS_PRO_DIR_URL . 'dist/dashboard.css',
				array( 'wp-components' ),
				GENERATEBLOCKS_PRO_VERSION
			);
		}
	}

	/**
	 * Add license key container.
	 *
	 * @since 1.2.0
	 */
	public function add_license_key_area() {
		echo '<div id="gblocks-license-key-settings"></div>';
	}

	/**
	 * Add Template Library container.
	 *
	 * @since 1.2.0
	 */
	public function add_template_library_settings() {
		echo '<div id="gblocks-template-library-settings"></div>';
	}
}

GenerateBlocks_Pro_Settings::get_instance();
