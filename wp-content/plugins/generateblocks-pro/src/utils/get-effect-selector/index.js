/**
 * Get our effect selector.
 *
 * @param {Array}  effectData The effect we're targeting.
 * @param {Object} attributes The attributes.
 * @param {string} selector The current selector.
 * @param {number} key The array key.
 * @return {Object} The data we need.
 */
export default function getEffectSelector( effectData, attributes, selector, key ) {
	const effects = effectData;

	let state = '';

	if ( 'undefined' !== typeof effects[ key ].state && 'normal' !== effects[ key ].state ) {
		state = effects[ key ].state;
	}

	let device = '';

	if ( 'undefined' !== typeof effects[ key ].device && 'all' !== effects[ key ].device ) {
		device = effects[ key ].device;
	}

	let backgroundType = '';

	if ( 'background' === effects[ key ].type ) {
		backgroundType = 'background';
	} else if ( 'gradient' === effects[ key ].type ) {
		backgroundType = 'gradient';
	}

	let element = 'element' + backgroundType + state + device;

	if ( effects[ key ].target && 'self' !== effects[ key ].target ) {
		element = effects[ key ].target + backgroundType + state + device;

		if ( effects[ key ].customSelector ) {
			element = effects[ key ].customSelector + backgroundType + state + device;
		}
	}

	if ( 'hover' === state ) {
		state = ':hover';
	}

	let effectSelector = selector + state;

	if ( 'innerContainer' === effects[ key ].target ) {
		effectSelector = '.gb-container-' + attributes.uniqueId + state + ' > .gb-inside-container';
	}

	if ( 'backgroundImage' === effects[ key ].target ) {
		effectSelector = selector + state + ':before';
	}

	if ( 'icon' === effects[ key ].target ) {
		effectSelector = selector + state + ' .gb-icon';
	}

	if ( 'customSelector' === effects[ key ].target ) {
		effectSelector = selector + state + ' ' + effects[ key ].customSelector;
	}

	if ( 'pseudo-element' === effects[ key ].target ) {
		effectSelector = selector + state + ':before';

		if ( 'undefined' !== typeof effects[ key ].direction ) {
			effectSelector = selector + state + ':after';
		}
	}

	return {
		element,
		effectSelector,
	};
}
