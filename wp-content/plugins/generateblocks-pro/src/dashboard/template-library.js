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
	ToggleControl,
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
			isAPISaving: false,
			isTemplateLibraryAPILoaded: false,
			isSyncingLibrary: false,
			enableRemoteTemplates: generateBlocksProSettings.adminSettings.enable_remote_templates,
			enableLocalTemplates: generateBlocksProSettings.adminSettings.enable_local_templates,
		};
	}

	componentDidMount() {
		this.setState( {
			isTemplateLibraryAPILoaded: true,
		} );
	}

	getSetting( name, defaultVal ) {
		let result = defaultVal;

		if ( 'undefined' !== typeof this.state.settings[ name ] ) {
			result = this.state.settings[ name ];
		}

		return result;
	}

	updateSettings( e ) {
		this.setState( { isAPISaving: true } );
		const message = e.target.nextElementSibling;

		apiFetch( {
			path: '/generateblocks-pro/v1/template-library',
			method: 'POST',
			data: {
				enableRemoteTemplates: this.state.enableRemoteTemplates,
				enableLocalTemplates: this.state.enableLocalTemplates,
			},
		} ).then( ( result ) => {
			this.setState( { isAPISaving: false } );
			message.classList.add( 'gblocks-action-message--show' );
			message.textContent = result.response;

			if ( ! result.success || ! result.response ) {
				message.classList.add( 'gblocks-action-message--error' );
			} else {
				setTimeout( function() {
					message.classList.remove( 'gblocks-action-message--show' );
				}, 3000 );
			}
		} );
	}

	render() {
		if ( ! this.state.isTemplateLibraryAPILoaded ) {
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
						title={ __( 'Pattern Library' ) }
					>
						<div className="gblocks-dashboard-panel-row-wrapper">
							<PanelRow>
								<ToggleControl
									label={ __( 'Enable Local Patterns', 'generateblocks-pro' ) }
									checked={ !! this.state.enableLocalTemplates }
									onChange={ ( value ) => {
										this.setState( {
											enableLocalTemplates: value,
										} );
									} }
								/>

								<ToggleControl
									label={ __( 'Enable Remote Patterns', 'generateblocks-pro' ) }
									checked={ !! this.state.enableRemoteTemplates }
									onChange={ ( value ) => {
										this.setState( {
											enableRemoteTemplates: value,
										} );
									} }
								/>

								{ !! this.state.enableRemoteTemplates &&
									<BaseControl
										id="gblocks-sync-template-library"
										className="gblocks-sync-template-library"
										help={ __( 'The pattern library syncs once a day by default. Clicking this button will force it to re-sync.', 'generateblocks-pro' ) }
									>
										<Button
											isSecondary
											onClick={ ( e ) => {
												this.setState( { isSyncingLibrary: true } );
												const message = e.target.nextElementSibling;

												apiFetch( {
													path: '/generateblocks-pro/v1/sync_template_library',
													method: 'POST',
												} ).then( ( result ) => {
													this.setState( { isSyncingLibrary: false } );
													message.classList.add( 'gblocks-action-message--show' );

													if ( ! result.success || ! result.response ) {
														message.classList.add( 'gblocks-action-message--error' );
														message.textContent = result;
													} else {
														message.textContent = __( 'Remote patterns synced.', 'generateblocks-pro' );

														setTimeout( function() {
															message.classList.remove( 'gblocks-action-message--show' );
														}, 3000 );
													}
												} );
											} }
										>
											{ this.state.isSyncingLibrary && <Spinner /> }
											{ ! this.state.isSyncingLibrary && __( 'Sync Remote Patterns', 'generateblocks-pro' ) }
										</Button>

										<span className="gblocks-action-message"></span>
									</BaseControl>
								}
							</PanelRow>

							<div className="gblocks-action-button">
								<Button
									isPrimary
									disabled={ this.state.isAPISaving }
									onClick={ ( e ) => this.updateSettings( e ) }
								>
									{ this.state.isAPISaving && <Spinner /> }
									{ ! this.state.isAPISaving && __( 'Save', 'generateblocks-pro' ) }
								</Button>

								<span className="gblocks-action-message"></span>
							</div>
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
		document.getElementById( 'gblocks-template-library-settings' )
	);
} );
