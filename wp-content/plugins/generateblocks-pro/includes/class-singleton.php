<?php
/**
 * GenerateBlocks Pro singleton class.
 *
 * @package Generateblocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * The Singleton class.
 */
abstract class GenerateBlocks_Pro_Singleton {
	/**
	 * Instance.
	 *
	 * @access private
	 * @var array Instances
	 */
	private static $instances = array();

	/**
	 * The Singleton's constructor should always be private to prevent direct
	 * construction calls with the `new` operator.
	 */
	protected function __construct() { }

	/**
	 * Singletons should not be cloneable.
	 */
	protected function __clone() { }

	/**
	 * Singletons should not be restorable from strings.
	 *
	 * @throws Exception Cannot unserialize a singleton.
	 */
	public function __wakeup() {
		throw new Exception( 'Cannot unserialize a singleton.' );
	}

	/**
	 * Initiator.
	 *
	 * @return object initialized object of class.
	 */
	public static function get_instance() {
		$cls = static::class;

		if ( ! isset( self::$instances[ $cls ] ) ) {
			self::$instances[ $cls ] = new static();
		}

		return self::$instances[ $cls ];
	}
}
