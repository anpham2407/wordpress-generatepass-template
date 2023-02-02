<?php
/**
 * Deprecated functions.
 *
 * @package GenerateBlocks Pro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Check if we need Safe SVG.
 *
 * @since 1.0.0
 * @deprecated 1.1.0
 */
function generateblocks_pro_has_safe_svg() {
	return is_plugin_active( 'safe-svg/safe-svg.php' ) || apply_filters( 'generateblocks_override_safe_svg_check', false );
}
