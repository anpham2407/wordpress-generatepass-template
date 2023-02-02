/**
 * WordPress Dependencies
 */
import {
	addFilter,
} from '@wordpress/hooks';

function addIconSets( iconSVGSets ) {
	iconSVGSets = { ...generateBlocksPro.svgIcons, ...iconSVGSets };

	return iconSVGSets;
}

addFilter(
	'generateblocks.editor.iconSVGSets',
	'generateblocks-pro/icon-sets/add-custom-svg-icons',
	addIconSets
);
