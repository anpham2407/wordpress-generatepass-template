<?php
/**
 * Set up the plugin.
 *
 * @package GenerateBlocks Pro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Load necessary files.
require_once GENERATEBLOCKS_PRO_DIR . 'includes/defaults.php';
require_once GENERATEBLOCKS_PRO_DIR . 'includes/general.php';
require_once GENERATEBLOCKS_PRO_DIR . 'includes/generate-css.php';
require_once GENERATEBLOCKS_PRO_DIR . 'includes/functions.php';
require_once GENERATEBLOCKS_PRO_DIR . 'includes/deprecated.php';
require_once GENERATEBLOCKS_PRO_DIR . 'includes/class-singleton.php';
require_once GENERATEBLOCKS_PRO_DIR . 'includes/class-local-templates.php';
require_once GENERATEBLOCKS_PRO_DIR . 'includes/class-global-styles.php';
require_once GENERATEBLOCKS_PRO_DIR . 'includes/class-rest.php';
require_once GENERATEBLOCKS_PRO_DIR . 'includes/class-settings.php';
require_once GENERATEBLOCKS_PRO_DIR . 'includes/class-asset-library.php';
require_once GENERATEBLOCKS_PRO_DIR . 'includes/class-plugin-update.php';
require_once GENERATEBLOCKS_PRO_DIR . 'includes/extend/query-loop/class-related-post.php';
require_once GENERATEBLOCKS_PRO_DIR . 'includes/extend/query-loop/class-related-parent.php';
require_once GENERATEBLOCKS_PRO_DIR . 'includes/extend/query-loop/class-related-author.php';
require_once GENERATEBLOCKS_PRO_DIR . 'includes/extend/query-loop/class-related-terms.php';
require_once GENERATEBLOCKS_PRO_DIR . 'includes/extend/dynamic-content/class-advanced-custom-fields.php';
