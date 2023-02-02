<?php
/**
 * Plugin Name: GenerateBlocks Pro
 * Plugin URI: https://generateblocks.com
 * Description: GenerateBlocks Pro adds more great features to GenerateBlocks without sacrificing usability or performance.
 * Author: Tom Usborne
 * Author URI: https://tomusborne.com
 * Version: 1.4.0
 * Requires at least: 5.6
 * Requires PHP: 5.6
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package GenerateBlocks Pro
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
update_option( 'generateblocks_pro_licensing', array('status'=>'valid','key'=>'activated') ); //raz0r
define( 'GENERATEBLOCKS_PRO_VERSION', '1.4.0' );
define( 'GENERATEBLOCKS_PRO_DIR', plugin_dir_path( __FILE__ ) );
define( 'GENERATEBLOCKS_PRO_DIR_URL', plugin_dir_url( __FILE__ ) );

add_action( 'plugins_loaded', 'generateblocks_pro_init' );
/**
 * Set up the plugin if GenerateBlocks exists.
 *
 * @since 1.0.0
 */
function generateblocks_pro_init() {
	if ( ! defined( 'GENERATEBLOCKS_VERSION' ) ) {
		add_action( 'admin_notices', 'generateblocks_pro_failed_load' );

		return;
	}

	$generateblocks_version_required = '1.3.0';
	if ( ! version_compare( GENERATEBLOCKS_VERSION, $generateblocks_version_required, '>=' ) ) {
		add_action( 'admin_notices', 'generateblocks_pro_failed_required_version' );

		return;
	}

	load_plugin_textdomain( 'generateblocks-pro', false, 'generateblocks-pro/languages' );
	require GENERATEBLOCKS_PRO_DIR . 'init.php';
}

/**
 * Show an admin notice if GenerateBlocks isn't active.
 *
 * @since 1.0.0
 */
function generateblocks_pro_failed_load() {
	$screen = get_current_screen();

	if ( isset( $screen->parent_file ) && 'plugins.php' === $screen->parent_file && 'update' === $screen->id ) {
		return;
	}

	$plugin = 'generateblocks/plugin.php';

	$installed_plugins = get_plugins();
	$is_generateblocks_installed = isset( $installed_plugins[ $plugin ] );

	if ( $is_generateblocks_installed ) {
		if ( ! current_user_can( 'activate_plugins' ) ) {
			return;
		}

		$activation_url = wp_nonce_url( 'plugins.php?action=activate&amp;plugin=' . $plugin . '&amp;plugin_status=all&amp;paged=1&amp;s', 'activate-plugin_' . $plugin );

		$message = '<p>' . __( 'GenerateBlocks Pro is not working because you need to activate the GenerateBlocks plugin.', 'generateblocks-pro' ) . '</p>';
		$message .= '<p>' . sprintf( '<a href="%s" class="button-primary">%s</a>', $activation_url, __( 'Activate GenerateBlocks Now', 'generateblocks-pro' ) ) . '</p>';
	} else {
		if ( ! current_user_can( 'install_plugins' ) ) {
			return;
		}

		$install_url = wp_nonce_url( self_admin_url( 'update.php?action=install-plugin&plugin=generateblocks' ), 'install-plugin_generateblocks' );

		$message = '<p>' . __( 'GenerateBlocks Pro is not working because you need to install the GenerateBlocks plugin.', 'generateblocks-pro' ) . '</p>';
		$message .= '<p>' . sprintf( '<a href="%s" class="button-primary">%s</a>', $install_url, __( 'Install GenerateBlocks Now', 'generateblocks-pro' ) ) . '</p>';
	}

	echo '<div class="error"><p>' . $message . '</p></div>'; // phpcs:ignore -- No escaping needed.
}

/**
 * Show an admin notice if GenerateBlocks isn't at its required version.
 *
 * @since 1.0.0
 */
function generateblocks_pro_failed_required_version() {
	if ( ! current_user_can( 'update_plugins' ) ) {
		return;
	}

	$file_path = 'generateblocks/plugin.php';

	$upgrade_link = wp_nonce_url( self_admin_url( 'update.php?action=upgrade-plugin&plugin=' ) . $file_path, 'upgrade-plugin_' . $file_path );
	$message = '<p>' . __( 'GenerateBlocks Pro is not working because you are using an old version of GenerateBlocks.', 'generateblocks-pro' ) . '</p>';
	$message .= '<p>' . sprintf( '<a href="%s" class="button-primary">%s</a>', $upgrade_link, __( 'Update GenerateBlocks Now', 'generateblocks-pro' ) ) . '</p>';

	echo '<div class="error"><p>' . $message . '</p></div>'; // phpcs:ignore -- No escaping needed.
}

add_action( 'init', 'generateblocks_pro_updater' );
/**
 * Check for and receive updates.
 *
 * @since 1.0.0
 */
function generateblocks_pro_updater() {
	$doing_cron = defined( 'DOING_CRON' ) && DOING_CRON;

	if ( ! current_user_can( 'manage_options' ) && ! $doing_cron ) {
		return;
	}

	if ( ! class_exists( 'GenerateBlocks_Plugin_Updater' ) ) {
		include GENERATEBLOCKS_PRO_DIR . 'includes/class-updater.php';
	}

	if ( ! function_exists( 'generateblocks_pro_get_license_defaults' ) ) {
		return;
	}

	$license_settings = wp_parse_args(
		get_option( 'generateblocks_pro_licensing', array() ),
		generateblocks_pro_get_license_defaults()
	);

	$license_key = trim( $license_settings['key'] );

	$edd_updater = new GenerateBlocks_Plugin_Updater(
		'https://generateblocks.com',
		__FILE__,
		array(
			'version' => GENERATEBLOCKS_PRO_VERSION,
			'license' => esc_attr( $license_key ),
			'item_id' => 1393,
			'author'  => 'GenerateBlocks',
			'beta'    => $license_settings['beta'] ? true : false,
		)
	);
}

add_filter( 'edd_sl_plugin_updater_api_params', 'generateblocks_pro_set_updater_api_params', 10, 3 );
/**
 * Add the GenerateBlocks version to our updater params.
 *
 * @param array  $api_params  The array of data sent in the request.
 * @param array  $api_data    The array of data set up in the class constructor.
 * @param string $plugin_file The full path and filename of the file.
 */
function generateblocks_pro_set_updater_api_params( $api_params, $api_data, $plugin_file ) {
	/*
	 * Make sure $plugin_file matches your plugin's file path. You should have a constant for this
	 * or can use __FILE__ if this code goes in your plugin's main file.
	 */
	if ( __FILE__ === $plugin_file ) {
		// Dynamically retrieve the current version number.
		$api_params['generateblocks_version'] = defined( 'GENERATEBLOCKS_VERSION' ) ? GENERATEBLOCKS_VERSION : '';
	}

	return $api_params;
}
