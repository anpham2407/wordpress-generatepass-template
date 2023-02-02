<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wp' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '_>z-X7nQmX4V_WZ-@7hv71<QzN7ZGAlk^&:*,[8E6CwfH|YLb+We eOawM[o]jq[' );
define( 'SECURE_AUTH_KEY',  ':OS)o<)67D%/o.|Dv<V^|ynOm3wUf8e/6Zv#Dj  <pNw}4&mOC=-Te7Gl/<Q4j?v' );
define( 'LOGGED_IN_KEY',    'I~&??k=]Qay@9+V7JW:?-Av+NBW,0dIQCu9UEd%5p0Uo3t]hT2/Xp.PE!xg`q.{>' );
define( 'NONCE_KEY',        '9mCxw>N<X-1cACe/lFB.1;sa>zJUzOQ+I-R_btDA89XA`ix?[tO_@ko[gPGpVpUQ' );
define( 'AUTH_SALT',        ',cvb`p&?k.BG>3`JF1G[sy~R0YmGFnFkInUW`Qi)IiXggQF[-]JBn;Odd8vu75%i' );
define( 'SECURE_AUTH_SALT', 's{J_]t=y78<63*cC9?Qjq%Qr<i{h0-9jW.w;P@R+}YQ[Vg88kcDMu*J]MDc9yQAY' );
define( 'LOGGED_IN_SALT',   'P,[5;CS//C6r7AnBTnrl-E`XE7^pvca|9+_.J#kmR72U;2KD&c3]:yB39z`^}1j4' );
define( 'NONCE_SALT',       'l_sH}eAoe<<~^I&`_B+868NK>xuL{E=n~KQ:5+P_63AbH}O7h[>G-qHdvg_5XB=0' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
