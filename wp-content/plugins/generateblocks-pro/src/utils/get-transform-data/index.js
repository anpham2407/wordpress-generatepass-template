import hasNumericValue from '../has-numeric-value';
import getEffectSelector from '../get-effect-selector';
/**
 * Check if we have a numeric value.
 *
 * @param {Array}  attributes The value to check.
 * @param {string} selector The selector we're working with.
 * @return {Array} Our transform data.
 */
export default function getTransformData( attributes, selector ) {
	const transformData = {};
	const transforms = attributes.transforms;

	if ( transforms ) {
		Object.keys( transforms ).forEach( function( key ) {
			const selectorData = getEffectSelector( transforms, attributes, selector, key );

			if ( 'undefined' === typeof transformData[ selectorData.element ] ) {
				transformData[ selectorData.element ] = {
					selector: selectorData.effectSelector,
					transforms: [],
					state: transforms[ key ].state,
					device: transforms[ key ].device,
				};
			}

			if ( 'translate' === transforms[ key ].type ) {
				let translateX = 0;
				let translateY = 0;

				if ( hasNumericValue( transforms[ key ].translateX ) ) {
					translateX = transforms[ key ].translateX + 'px';
				}

				if ( hasNumericValue( transforms[ key ].translateY ) ) {
					translateY = transforms[ key ].translateY + 'px';
				}

				if ( translateX || translateY ) {
					transformData[ selectorData.element ].transforms.push( 'translate3d(' + translateX + ',' + translateY + ',0)' );
				}
			}

			if ( 'rotate' === transforms[ key ].type ) {
				if ( transforms[ key ].rotate || 0 === transforms[ key ].rotate ) {
					transformData[ selectorData.element ].transforms.push( 'rotate(' + transforms[ key ].rotate + 'deg)' );
				}
			}

			if ( 'skew' === transforms[ key ].type ) {
				if ( transforms[ key ].skewX || 0 === transforms[ key ].skewY ) {
					transformData[ selectorData.element ].transforms.push( 'skewX(' + transforms[ key ].skewX + 'deg)' );
				}

				if ( transforms[ key ].skewY || 0 === transforms[ key ].skewY ) {
					transformData[ selectorData.element ].transforms.push( 'skewY(' + transforms[ key ].skewY + 'deg)' );
				}
			}

			if ( 'scale' === transforms[ key ].type ) {
				if ( transforms[ key ].scale || 0 === transforms[ key ].scale ) {
					transformData[ selectorData.element ].transforms.push( 'scale(' + transforms[ key ].scale + ')' );
					transformData[ selectorData.element ].transforms.push( 'perspective(1000px)' ); // Activate GPU.
				}
			}
		} );
	}

	return transformData;
}
