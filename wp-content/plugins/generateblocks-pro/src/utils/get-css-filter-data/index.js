import hasNumericValue from '../has-numeric-value';
import getEffectSelector from '../get-effect-selector';
/**
 * Check if we have a numeric value.
 *
 * @param {Array}  attributes The value to check.
 * @param {string} selector The selector we're working with.
 * @return {Array} Our transform data.
 */
export default function getCSSFilterData( attributes, selector ) {
	const filterData = {};
	const filters = attributes.filters;

	if ( filters ) {
		Object.keys( filters ).forEach( function( key ) {
			const selectorData = getEffectSelector( filters, attributes, selector, key );

			if ( 'undefined' === typeof filterData[ selectorData.element ] ) {
				filterData[ selectorData.element ] = {
					selector: selectorData.effectSelector,
					filters: [],
					state: filters[ key ].state,
					device: filters[ key ].device,
				};
			}

			if ( 'blur' === filters[ key ].type ) {
				if ( hasNumericValue( filters[ key ].blur ) ) {
					filterData[ selectorData.element ].filters.push( 'blur(' + filters[ key ].blur + 'px)' );
				}
			}

			if ( 'brightness' === filters[ key ].type ) {
				if ( hasNumericValue( filters[ key ].brightness ) ) {
					filterData[ selectorData.element ].filters.push( 'brightness(' + filters[ key ].brightness + '%)' );
				}
			}

			if ( 'contrast' === filters[ key ].type ) {
				if ( hasNumericValue( filters[ key ].contrast ) ) {
					filterData[ selectorData.element ].filters.push( 'contrast(' + filters[ key ].contrast + '%)' );
				}
			}

			if ( 'grayscale' === filters[ key ].type ) {
				if ( hasNumericValue( filters[ key ].grayscale ) ) {
					filterData[ selectorData.element ].filters.push( 'grayscale(' + filters[ key ].grayscale + '%)' );
				}
			}

			if ( 'hue-rotate' === filters[ key ].type ) {
				if ( hasNumericValue( filters[ key ].hueRotate ) ) {
					filterData[ selectorData.element ].filters.push( 'hue-rotate(' + filters[ key ].hueRotate + 'deg)' );
				}
			}

			if ( 'invert' === filters[ key ].type ) {
				if ( hasNumericValue( filters[ key ].invert ) ) {
					filterData[ selectorData.element ].filters.push( 'invert(' + filters[ key ].invert + '%)' );
				}
			}

			if ( 'saturate' === filters[ key ].type ) {
				if ( hasNumericValue( filters[ key ].saturate ) ) {
					filterData[ selectorData.element ].filters.push( 'saturate(' + filters[ key ].saturate + '%)' );
				}
			}

			if ( 'sepia' === filters[ key ].type ) {
				if ( hasNumericValue( filters[ key ].sepia ) ) {
					filterData[ selectorData.element ].filters.push( 'sepia(' + filters[ key ].sepia + '%)' );
				}
			}
		} );
	}

	return filterData;
}
