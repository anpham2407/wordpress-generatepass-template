/**
 * WordPress dependencies
 */
import {
	__,
} from '@wordpress/i18n';

import {
	BaseControl,
	Button,
	PanelBody,
	PanelRow,
	Placeholder,
	Spinner,
	TextControl,
	ToggleControl,
	Notice,
} from '@wordpress/components';

import {
	render,
	Component,
	Fragment,
} from '@wordpress/element';

import apiFetch from '@wordpress/api-fetch';

class App extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isLicenseKeyAPILoaded: false,
			isAPISaving: false,
			licenseSettings: generateBlocksProSettings.licenseSettings,
		};
	}

	componentDidMount() {
		this.setState( {
			isLicenseKeyAPILoaded: true,
		} );
	}

	getSetting( name, defaultVal ) {
		let result = defaultVal;

		if ( 'undefined' !== typeof this.state.licenseSettings[ name ] ) {
			result = this.state.licenseSettings[ name ];
		}

		return result;
	}

	updateSettings( e ) {
		this.setState( { isAPISaving: true } );
		const message = e.target.nextElementSibling;
		message.classList.remove( 'gblocks-action-message--show' );

		apiFetch( {
			path: '/generateblocks-pro/v1/license',
			method: 'POST',
			data: {
				licenseSettings: this.state.licenseSettings,
			},
		} ).then( ( result ) => {
			this.setState( { isAPISaving: false } );
			message.classList.add( 'gblocks-action-message--show' );

			if ( ! result.success || ! result.response ) {
				message.classList.add( 'gblocks-action-message--error' );
				message.textContent = result.response;
			} else {
				message.classList.remove( 'gblocks-action-message--error' );

				if ( 'valid' === result.response.license ) {
					message.textContent = __( 'License key activated.', 'generateblocks-pro' );
				} else if ( 'deactivated' === result.response.license ) {
					message.textContent = __( 'License key deactivated.', 'generateblocks-pro' );
				} else {
					message.textContent = result.response;
				}

				this.setState( {
					licenseSettings: {
						...this.state.licenseSettings,
						status: result.response.license,
					},
				} );

				setTimeout( function() {
					message.classList.remove( 'gblocks-action-message--show' );
				}, 3000 );
			}
		} );
	}

	render() {
		if ( ! this.state.isLicenseKeyAPILoaded ) {
			return (
				<Placeholder className="gblocks-settings-placeholder">
					<Spinner />
				</Placeholder>
			);
		}

		return (
			<Fragment>
				<div className="generateblocks-settings-main">
					<PanelBody
						title={ __( 'License Key' ) }
					>
						<div className="gblocks-dashboard-panel-row-wrapper">
							<PanelRow>
								<BaseControl
									id="gblocks-license-key-area"
									className="gblocks-license-key-area"
								>
									<Notice
										className="gblocks-licensing-notice"
										isDismissible={ false }
										status={ 'valid' === this.state.licenseSettings.status ? 'success' : 'warning' }
									>
										{ 'valid' === this.state.licenseSettings.status ? (
											<span>
												{ __( 'Receiving updates', 'generateblocks-pro' ) }
											</span>
										) : (
											<span>
												{ __( 'Not receiving updates', 'generateblocks-pro' ) }
											</span>
										) }
									</Notice>

									<TextControl
										type="password"
										autoComplete="off"
										placeholder={ __( 'Enter your license key here…', 'generateblocks-pro' ) }
										value={ this.getSetting( 'key' ) }
										onChange={ ( value ) => {
											this.setState( {
												licenseSettings: {
													...this.state.licenseSettings,
													key: value,
												},
											} );
										} }
									/>
								</BaseControl>
							</PanelRow>

							{ '' !== this.state.licenseSettings.key &&
								<PanelRow>
									<BaseControl>
										<ToggleControl
											label={ __( 'Receive beta updates' ) }
											help={ __( 'Get alpha and beta updates directly to your Dashboard.', 'generateblocks-pro' ) }
											checked={ !! this.getSetting( 'beta' ) }
											onChange={ ( value ) => {
												this.setState( {
													licenseSettings: {
														...this.state.licenseSettings,
														beta: value,
													},
												} );
											} }
										/>
									</BaseControl>
								</PanelRow>
							}

							<PanelRow>
								<div className="gblocks-action-button">
									<Button
										isPrimary
										disabled={ this.state.isAPISaving }
										onClick={ ( e ) => this.updateSettings( e ) }
									>
										{ this.state.isAPISaving && <Spinner /> }
										{ ! this.state.isAPISaving && __( 'Save' ) }
									</Button>

									<span className="gblocks-action-message"></span>
								</div>
							</PanelRow>
						</div>
					</PanelBody>
				</div>
			</Fragment>
		);
	}
}

window.addEventListener( 'DOMContentLoaded', () => {
	render(
		<App />,
		document.getElementById( 'gblocks-license-key-settings' )
	);
} );
