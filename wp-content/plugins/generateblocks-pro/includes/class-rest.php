<?php
/**
 * Rest API functions
 *
 * @package GenerateBlocks Pro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GenerateBlocks_Rest
 */
class GenerateBlocks_Pro_Rest extends WP_REST_Controller {
	/**
	 * Instance.
	 *
	 * @access private
	 * @var object Instance
	 */
	private static $instance;

	/**
	 * Namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'generateblocks-pro/v';

	/**
	 * Version.
	 *
	 * @var string
	 */
	protected $version = '1';

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
	 * GenerateBlocks_Rest constructor.
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register rest routes.
	 */
	public function register_routes() {
		$namespace = $this->namespace . $this->version;

		// Get Templates.
		register_rest_route(
			$namespace,
			'/get_templates/',
			array(
				'methods'  => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_templates' ),
				'permission_callback' => array( $this, 'edit_posts_permission' ),
			)
		);

		// Get template data.
		register_rest_route(
			$namespace,
			'/get_template_data/',
			array(
				'methods'  => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_template_data' ),
				'permission_callback' => array( $this, 'edit_posts_permission' ),
			)
		);

		// Save template library options.
		register_rest_route(
			$namespace,
			'/template-library/',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_template_library_settings' ),
				'permission_callback' => array( $this, 'update_settings_permission' ),
			)
		);

		// Regenerate CSS Files.
		register_rest_route(
			$namespace,
			'/sync_template_library/',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'sync_template_library' ),
				'permission_callback' => array( $this, 'update_settings_permission' ),
			)
		);

		// Update licensing.
		register_rest_route(
			$namespace,
			'/license/',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_licensing' ),
				'permission_callback' => array( $this, 'update_settings_permission' ),
			)
		);

		// Update Shapes.
		register_rest_route(
			$namespace,
			'/shape-settings/',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_shape_settings' ),
				'permission_callback' => array( $this, 'update_settings_permission' ),
			)
		);

		// Update Shapes.
		register_rest_route(
			$namespace,
			'/inline-svg/',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'do_inline_svg' ),
				'permission_callback' => array( $this, 'update_settings_permission' ),
			)
		);

		// Update Icons.
		register_rest_route(
			$namespace,
			'/icon-settings/',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_icon_settings' ),
				'permission_callback' => array( $this, 'update_settings_permission' ),
			)
		);

		// Export Assets.
		register_rest_route(
			$namespace,
			'/export-asset-group/',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'export_asset_group' ),
				'permission_callback' => array( $this, 'update_settings_permission' ),
			)
		);
	}

	/**
	 * Get edit options permissions.
	 *
	 * @return bool
	 */
	public function update_settings_permission() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Get edit posts permissions.
	 *
	 * @return bool
	 */
	public function edit_posts_permission() {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Get templates.
	 *
	 * @return mixed
	 */
	public function get_templates() {
		$url       = 'https://library.generateblocks.com/wp-json/templates/get_templates';
		$templates = get_transient( 'generateblocks_templates', false );

		/*
		 * Get remote templates.
		 */
		if ( ! $templates ) {
			$requested_templates = wp_remote_get( $url );

			if ( ! is_wp_error( $requested_templates ) ) {
				$new_templates = wp_remote_retrieve_body( $requested_templates );
				$new_templates = json_decode( $new_templates, true );

				if ( $new_templates && isset( $new_templates['response'] ) && is_array( $new_templates['response'] ) ) {
					$templates = $new_templates['response'];

					set_transient( 'generateblocks_templates', $templates, DAY_IN_SECONDS );
				}
			} else {
				$templates = array(
					array(
						'error' => $requested_templates->get_error_messages(),
					),
				);
			}
		}

		/*
		 * Get user templates from db.
		 */

		$args = array(
			'post_type'     => 'gblocks_templates',
			'fields'        => 'ids',
			'no_found_rows' => true,
			'post_status'   => 'any',
			'numberposts'   => 500, // phpcs:ignore
			'post_status'   => 'publish',
		);

		$all_templates = get_posts( $args );
		$local_templates = array();

		foreach ( $all_templates as $id ) {
			$image_id   = get_post_thumbnail_id( $id );
			$image_data = wp_get_attachment_image_src( $image_id, 'large' );

			$local_templates[] = array(
				'id'    => $id,
				'title' => get_the_title( $id ),
				'types' => array(
					array(
						'slug' => 'local',
					),
				),
				'url'              => get_post_permalink( $id ),
				'thumbnail'        => isset( $image_data[0] ) ? $image_data[0] : false,
				'thumbnail_width'  => isset( $image_data[1] ) ? $image_data[1] : false,
				'thumbnail_height' => isset( $image_data[2] ) ? $image_data[2] : false,
			);
		}

		// merge all available templates.
		$templates = array_merge( (array) $templates, $local_templates );

		if ( is_array( $templates ) ) {
			return $this->success( $templates );
		} else {
			return $this->error( 'no_templates', __( 'Templates not found.', 'generateblocks-pro' ) );
		}
	}

	/**
	 * Get templates.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function get_template_data( WP_REST_Request $request ) {
		$url           = 'https://library.generateblocks.com/wp-json/templates/get_template';
		$id            = $request->get_param( 'id' );
		$type          = $request->get_param( 'type' );
		$template_data = false;

		switch ( $type ) {
			case 'remote':
				$cached_template_data = get_transient( 'generateblocks_template_data', array() );

				if ( isset( $cached_template_data[ $id ] ) ) {
					$template_data = $cached_template_data[ $id ];
				}

				if ( ! $template_data ) {
					$requested_template_data = wp_remote_get(
						add_query_arg(
							array(
								'id' => $id,
							),
							$url
						)
					);

					if ( ! is_wp_error( $requested_template_data ) ) {
						$new_template_data = wp_remote_retrieve_body( $requested_template_data );
						$new_template_data = json_decode( $new_template_data, true );

						if ( $new_template_data && isset( $new_template_data['response'] ) && is_array( $new_template_data['response'] ) ) {
							$template_data = $new_template_data['response'];

							$cached_template_data[ $id ] = $template_data;
							set_transient( 'generateblocks_template_data', $cached_template_data, DAY_IN_SECONDS );
						}
					}
				}
				break;

			case 'local':
				$post = get_post( $id );

				if ( $post && 'gblocks_templates' === $post->post_type ) {
					$template_data = array(
						'id'      => $post->ID,
						'title'   => $post->post_title,
						'content' => $post->post_content,
					);
				}

				break;
		}

		if ( is_array( $template_data ) ) {
			return $this->success( $template_data );
		} else {
			return $this->error( 'no_template_data', __( 'Template data not found.', 'generateblocks-pro' ) );
		}
	}

	/**
	 * Update Settings.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function update_template_library_settings( WP_REST_Request $request ) {
		$current_settings = get_option( 'generateblocks_admin', array() );
		$remote_templates = $request->get_param( 'enableRemoteTemplates' );
		$local_templates = $request->get_param( 'enableLocalTemplates' );

		$current_settings['enable_remote_templates'] = $remote_templates;
		$current_settings['enable_local_templates'] = $local_templates;

		update_option( 'generateblocks_admin', $current_settings );

		return $this->success( __( 'Settings saved.', 'generateblocks-pro' ) );
	}

	/**
	 * Sync the template library.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function sync_template_library( WP_REST_Request $request ) {
		delete_transient( 'generateblocks_templates' );
		delete_transient( 'generateblocks_template_data' );

		return $this->success( true );
	}

	/**
	 * Update Settings.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function update_licensing( WP_REST_Request $request ) {
		$new_license_data = $request->get_param( 'licenseSettings' );
		$new_settings = array();

		$license_settings = wp_parse_args(
			get_option( 'generateblocks_pro_licensing', array() ),
			generateblocks_pro_get_license_defaults()
		);

		$old_license = $license_settings['key'];
		$new_license = trim( $new_license_data['key'] );

		if ( $new_license ) {
			$api_params = array(
				'edd_action' => 'activate_license',
				'license'    => sanitize_key( $new_license ),
				'item_name'  => rawurlencode( 'GenerateBlocks Pro' ),
				'url'        => home_url(),
			);
		} elseif ( $old_license && 'valid' === $license_settings['status'] ) {
			$api_params = array(
				'edd_action' => 'deactivate_license',
				'license'    => sanitize_key( $old_license ),
				'item_name'  => rawurlencode( 'GenerateBlocks Pro' ),
				'url'        => home_url(),
			);
		}

		if ( isset( $api_params ) ) {
			$response = wp_remote_post(
				'https://generateblocks.com',
				array(
					'timeout' => 15,
					'sslverify' => false,
					'body' => $api_params,
				)
			);

			if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
				if ( is_wp_error( $response ) ) {
					return $this->failed( $response->get_error_message() );
				} else {
					$message = __( 'An error occurred, please try again.', 'generateblocks-pro' );
				}
			} else {
				$license_data = json_decode( wp_remote_retrieve_body( $response ) );

				if ( false === $license_data->success ) {
					switch ( $license_data->error ) {
						case 'expired':
							$message = sprintf(
								/* translators: License key expiration date. */
								__( 'Your license key expired on %s.', 'generateblocks-pro' ),
								date_i18n( get_option( 'date_format' ), strtotime( $license_data->expires, current_time( 'timestamp' ) ) ) // phpcs:ignore
							);
							break;

						case 'disabled':
						case 'revoked':
							$message = __( 'Your license key has been disabled.', 'generateblocks-pro' );
							break;

						case 'missing':
							$message = __( 'Invalid license.', 'generateblocks-pro' );
							break;

						case 'invalid':
						case 'site_inactive':
							$message = __( 'Your license is not active for this URL.', 'generateblocks-pro' );
							break;

						case 'item_name_mismatch':
							/* translators: GenerateBlocks Pro */
							$message = sprintf( __( 'This appears to be an invalid license key for %s.', 'generateblocks-pro' ), __( 'GenerateBlocks Pro', 'generateblocks-pro' ) );
							break;

						case 'no_activations_left':
							$message = __( 'Your license key has reached its activation limit.', 'generateblocks-pro' );
							break;

						default:
							$message = __( 'An error occurred, please try again.', 'generateblocks-pro' );
							break;
					}
				}
			}

			$new_settings['status'] = esc_attr( $license_data->license );
		}

		if ( isset( $new_license_data['beta'] ) ) {
			$new_settings['beta'] = sanitize_key( $new_license_data['beta'] );
		}

		$new_settings['key'] = sanitize_key( $new_license );

		if ( is_array( $new_settings ) ) {
			$current_settings = get_option( 'generateblocks_pro_licensing', array() );
			update_option( 'generateblocks_pro_licensing', array_merge( $current_settings, $new_settings ) );

			if ( ! isset( $api_params ) ) {
				return $this->success( __( 'Settings saved.', 'generateblocks-pro' ) );
			}
		}

		if ( ! empty( $message ) ) {
			return $this->failed( $message );
		}

		return $this->success( $license_data );
	}

	/**
	 * Update Shapes.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function update_shape_settings( WP_REST_Request $request ) {
		$current_settings = get_option( 'generateblocks_svg_shapes', array() );
		$new_settings = $request->get_param( 'settings' );
		$new_shapes = array();
		$usedGroupNames = array();

		foreach ( $new_settings as $index => $data ) {
			// Build our group name and ID.
			if ( ! in_array( $data['group'], $usedGroupNames ) ) {
				$new_shapes[ $index ]['group'] = sanitize_text_field( $data['group'] );
				$new_shapes[ $index ]['group_id'] = str_replace( ' ', '-', strtolower( $new_shapes[ $index ]['group'] ) );
				$usedGroupNames[] = $new_shapes[ $index ]['group'];
			} else {
				$new_shapes[ $index ]['group'] = sanitize_text_field( $data['group'] . ' ' . $index );
				$new_shapes[ $index ]['group_id'] = str_replace( ' ', '-', strtolower( $new_shapes[ $index ]['group'] ) );
				$usedGroupNames[] = $new_shapes[ $index ]['group'];
			}

			if ( ! empty( $data['shapes'] ) ) {
				foreach ( $data['shapes'] as $shape_index => $shape ) {
					// Build our unique ID if we need to.
					if ( empty( $new_settings[ $index ]['shapes'][ $shape_index ]['id'] ) && empty( $current_settings[ $index ]['shapes'][ $shape_index ]['id'] ) ) {
						// Needs a unique ID.
						$lowercase_name = str_replace( ' ', '-', strtolower( $shape['name'] ) );
						$new_shapes[ $index ]['shapes'][ $shape_index ]['id'] = sanitize_key( $lowercase_name . '-' . uniqid() );
					} elseif ( ! empty( $new_settings[ $index ]['shapes'][ $shape_index ]['id'] ) && empty( $current_settings[ $index ]['shapes'][ $shape_index ]['id'] ) ) {
						// Has a unique ID but hasn't saved it yet (imported).
						$new_shapes[ $index ]['shapes'][ $shape_index ]['id'] = sanitize_key( $new_settings[ $index ]['shapes'][ $shape_index ]['id'] );
					} else {
						// Has a unique ID, keep it.
						$new_shapes[ $index ]['shapes'][ $shape_index ]['id'] = sanitize_key( $current_settings[ $index ]['shapes'][ $shape_index ]['id'] );
					}

					// Sanitize our name.
					$new_shapes[ $index ]['shapes'][ $shape_index ]['name'] = sanitize_text_field( $shape['name'] );

					// Sanitize our SVG.
					if ( current_user_can( 'unfiltered_html' ) ) {
						$new_shapes[ $index ]['shapes'][ $shape_index ]['shape'] = $shape['shape'];
					} else {
						$new_shapes[ $index ]['shapes'][ $shape_index ]['shape'] = wp_kses( $shape['shape'], generateblocks_pro_kses_svg() );
					}
				}
			} else {
				unset( $new_shapes[ $index ] );
			}
		}

		if ( is_array( $new_shapes ) ) {
			update_option( 'generateblocks_svg_shapes', $new_shapes );
		}

		return $this->success( __( 'Shapes saved.', 'generateblocks-pro' ) );
	}

	/**
	 * Update Icons.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function update_icon_settings( WP_REST_Request $request ) {
		$current_settings = get_option( 'generateblocks_svg_icons', array() );
		$new_settings = $request->get_param( 'settings' );
		$new_icons = array();
		$usedGroupNames = array();

		foreach ( $new_settings as $index => $data ) {
			// Build our group name and ID.
			if ( ! in_array( $data['group'], $usedGroupNames ) ) {
				$new_icons[ $index ]['group'] = sanitize_text_field( $data['group'] );
				$new_icons[ $index ]['group_id'] = str_replace( ' ', '-', strtolower( $new_icons[ $index ]['group'] ) );
				$usedGroupNames[] = $new_icons[ $index ]['group'];
			} else {
				$new_icons[ $index ]['group'] = sanitize_text_field( $data['group'] . ' ' . $index );
				$new_icons[ $index ]['group_id'] = str_replace( ' ', '-', strtolower( $new_icons[ $index ]['group'] ) );
				$usedGroupNames[] = $new_icons[ $index ]['group'];
			}

			if ( ! empty( $data['icons'] ) ) {
				foreach ( $data['icons'] as $icon_index => $icon ) {
					// Build our unique ID if we need to.
					if ( empty( $new_settings[ $index ]['icons'][ $icon_index ]['id'] ) && empty( $current_settings[ $index ]['icons'][ $icon_index ]['id'] ) ) {
						// Needs a unique ID.
						$lowercase_name = str_replace( ' ', '-', strtolower( $icon['name'] ) );
						$new_icons[ $index ]['icons'][ $icon_index ]['id'] = sanitize_key( $lowercase_name . '-' . uniqid() );
					} elseif ( ! empty( $new_settings[ $index ]['icons'][ $icon_index ]['id'] ) && empty( $current_settings[ $index ]['icons'][ $icon_index ]['id'] ) ) {
						// Has a unique ID but hasn't saved it yet (imported).
						$new_icons[ $index ]['icons'][ $icon_index ]['id'] = sanitize_key( $new_settings[ $index ]['icons'][ $icon_index ]['id'] );
					} else {
						// Has a unique ID, keep it.
						$new_icons[ $index ]['icons'][ $icon_index ]['id'] = sanitize_key( $current_settings[ $index ]['icons'][ $icon_index ]['id'] );
					}

					// Sanitize our name.
					$new_icons[ $index ]['icons'][ $icon_index ]['name'] = sanitize_text_field( $icon['name'] );

					// Sanitize our SVG.
					if ( current_user_can( 'unfiltered_html' ) ) {
						$new_icons[ $index ]['icons'][ $icon_index ]['icon'] = $icon['icon'];
					} else {
						$new_icons[ $index ]['icons'][ $icon_index ]['icon'] = wp_kses( $icon['icon'], generateblocks_pro_kses_svg() );
					}
				}
			} else {
				unset( $new_icons[ $index ] );
			}
		}

		if ( is_array( $new_icons ) ) {
			update_option( 'generateblocks_svg_icons', $new_icons );
		}

		return $this->success( __( 'Icons saved.', 'generateblocks-pro' ) );
	}

	/**
	 * Convert SVG file to inline. The result of this is sanitized using DOMPurify when it
	 * reaches its destination.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function do_inline_svg( WP_REST_Request $request ) {
		$url = $request->get_param( 'url' );
		$svg_html = file_get_contents( esc_url( $url ) ); // phpcs:ignore -- file_get_contents() is the right function for this.

		return $this->success( $svg_html );
	}

	/**
	 * Export a group of assets.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function export_asset_group( WP_REST_Request $request ) {
		$asset_type = $request->get_param( 'assetType' );
		$group_name = $request->get_param( 'groupName' );
		$assets = $request->get_param( 'assets' );

		$data = array(
			'type' => $asset_type,
			'group' => $group_name,
			'assets' => $assets,
		);

		return $this->success( $data );
	}

	/**
	 * Success rest.
	 *
	 * @param mixed $response response data.
	 * @return mixed
	 */
	public function success( $response ) {
		return new WP_REST_Response(
			array(
				'success'  => true,
				'response' => $response,
			),
			200
		);
	}

	/**
	 * Failed rest.
	 *
	 * @param mixed $response response data.
	 * @return mixed
	 */
	public function failed( $response ) {
		return new WP_REST_Response(
			array(
				'success'  => false,
				'response' => $response,
			),
			200
		);
	}

	/**
	 * Error rest.
	 *
	 * @param mixed $code     error code.
	 * @param mixed $response response data.
	 * @return mixed
	 */
	public function error( $code, $response ) {
		return new WP_REST_Response(
			array(
				'error'      => true,
				'success'    => false,
				'error_code' => $code,
				'response'   => $response,
			),
			401
		);
	}
}

GenerateBlocks_Pro_Rest::get_instance();
