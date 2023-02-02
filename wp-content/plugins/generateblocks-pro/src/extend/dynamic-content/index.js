import { addFilter } from '@wordpress/hooks';
import { has, isArray, isObject } from 'lodash';
import { __ } from '@wordpress/i18n';
import { SimpleSelect } from '../../components/advanced-select';

/**
 * This enables ACF to format fields in the rest API.
 *
 * @param {Array} params The request params for getEntityRecord.
 * @return {Array} The filtered request params.
 * @see https://www.advancedcustomfields.com/resources/wp-rest-api-integration/#controlling-output-format
 */
function enableACFFormattedFields( params ) {
	if ( !! generateBlocksPro && generateBlocksPro?.isACFActive ) {
		return [ ...params, { acf_format: 'standard' } ];
	}

	return params;
}

addFilter(
	'generateblocks.editor.dynamicContent.post-request-params',
	'generateblocks-pro/dynamic-content/post-request-params',
	enableACFFormattedFields,
);

addFilter(
	'generateblocks.editor.dynamicContent.author-request-params',
	'generateblocks-pro/dynamic-content/author-request-params',
	enableACFFormattedFields,
);

/**
 * Extend dynamic content attributes.
 *
 * @param {Object} attributes The block attributes.
 * @return {Object} The extended block attributes.
 */
function extendDynamicContentAttributes( attributes ) {
	return Object.assign( {}, attributes, {
		metaFieldPropertyName: {
			type: 'string',
			default: '',
		},
		linkMetaFieldPropertyName: {
			type: 'string',
			default: '',
		},
	} );
}

addFilter(
	'generateblocks.editor.dynamicContent.attributes',
	'generateblocks-pro/dynamic-content/attributes',
	extendDynamicContentAttributes
);

/**
 * Enables ACF fields on the post record.
 *
 * @param {Object|undefined} record The post record.
 * @return {Object|undefined} The hooked post record.
 */
function enableACFPostMetaFields( record ) {
	if (
		isObject( record ) &&
		( has( record, 'acf' ) && isObject( record?.acf ) ) &&
		( has( record, 'meta' ) && isObject( record?.meta ) )
	) {
		const meta = Object.assign( {}, record?.meta, record?.acf );

		return Object.assign( {}, record, { meta } );
	}

	return record;
}

addFilter(
	'generateblocks.editor.dynamicContent.postRecord',
	'generateblocks-pro/dynamic-content/post-record',
	enableACFPostMetaFields
);

/**
 * Enables ACF fields on the author record.
 *
 * @param {Object|undefined} record The post record.
 * @return {Object|undefined} The hooked post record.
 */
function enableACFAuthorMetaFields( record ) {
	if (
		isObject( record ) &&
		( has( record, 'author' ) && isObject( record.author ) ) &&
		( has( record.author, 'meta' ) && isObject( record.author.meta ) ) &&
		( has( record.author, 'acf' ) && isObject( record.author.acf ) )
	) {
		const meta = Object.assign( {}, record.author.meta, record.author.acf );

		return Object.assign( {}, record, { author: { meta } } );
	}

	return record;
}

addFilter(
	'generateblocks.editor.dynamicContent.postRecord',
	'generateblocks-pro/dynamic-content/post-record',
	enableACFAuthorMetaFields
);

/**
 * Add support for object meta values.
 *
 * @param {*}      metaValue  The meta value.
 * @param {Object} attributes The block attributes.
 * @return {*} The filtered meta value.
 */
function filterPostMetaValues( metaValue, attributes ) {
	if ( isObject( metaValue ) ) {
		if ( ! attributes.metaFieldPropertyName ) {
			return __( 'Select value property', 'generateblocks-pro' );
		} else if ( metaValue.hasOwnProperty( attributes.metaFieldPropertyName ) ) {
			return metaValue[ attributes.metaFieldPropertyName ];
		}
	}

	return metaValue;
}

addFilter(
	'generateblocks.editor.dynamicContent.postMetaField',
	'generateblocks-pro/dynamic-content/post-meta-field',
	filterPostMetaValues
);

/**
 * Extend PostMetaControl component.
 *
 * @param {JSX.Element|undefined} component The component.
 * @param {Object}                props     The component props.
 * @param {Object}                record    The post record.
 * @return {JSX.Element} The component to add after the PostMetaControl.
 */
export function afterPostMetaControl( component, props, record ) {
	const {
		metaFieldKey = 'metaFieldName',
		metaFieldName,
		setAttributes,
		attributes,
	} = props;

	const propertyKey = 'metaFieldName' === metaFieldKey ? 'metaFieldPropertyName' : 'linkMetaFieldPropertyName';

	if ( ! generateBlocksPro?.isACFActive || ! metaFieldName || ! record ) {
		return component;
	}

	const recordMeta = 'author-meta' === attributes.dynamicContentType && !! record?.author?.meta
		? record?.author?.meta
		: record?.meta;

	const metaValue = recordMeta ? recordMeta[ metaFieldName ] : '';

	// We are not supporting multi-values yet, so we bail out early.
	if ( isArray( metaValue ) ) {
		return component;
	}

	if ( isObject( metaValue ) ) {
		const options = Object
			.keys( metaValue )
			.map( ( key ) => ( { label: key, value: key } ) );

		return (
			<SimpleSelect
				label={ __( 'Post meta sub field', 'generateblocks-pro' ) }
				options={ options }
				value={ attributes[ propertyKey ] }
				onChange={ ( metaFieldPropertyName ) => {
					setAttributes( { [ propertyKey ]: metaFieldPropertyName } );
				} }
			/>
		);
	}
}

addFilter(
	'generateblocks.editor.dynamicContent.PostMetaControl.afterComponent',
	'generateblocks-pro/dynamic-content/extend-post-meta-control',
	afterPostMetaControl
);

addFilter(
	'generateblocks.editor.dynamicContent.AuthorMetaControl.afterComponent',
	'generateblocks-pro/dynamic-content/extend-post-meta-control',
	afterPostMetaControl
);

/**
 * This enables ACF to format fields in the rest API.
 *
 * @param {Object} queryArgs The getEntityRecords query args.
 * @return {Object} The filtered query args.
 * @see https://www.advancedcustomfields.com/resources/wp-rest-api-integration/#controlling-output-format
 */
function addQueryArgToFormatACFFields( queryArgs ) {
	return Object.assign( {}, queryArgs, {
		acf_format: 'standard',
	} );
}

addFilter(
	'generateblocks.editor.hooks.usePostTypeRecordsQueryArgs',
	'generateblocks-pro/hooks/use-post-type-records-query-args',
	addQueryArgToFormatACFFields
);
