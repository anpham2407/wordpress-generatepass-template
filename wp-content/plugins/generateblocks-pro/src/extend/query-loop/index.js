import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';

/**
 * Returns current post type.
 *
 * @return {Object|undefined} The current post object.
 */
function getCurrentPost() {
	if (
		wp &&
		wp.data &&
		wp.data.select &&
		wp.data.select( 'core/editor' ) &&
		wp.data.select( 'core/editor' ).getCurrentPost
	) {
		return wp.data.select( 'core/editor' ).getCurrentPost();
	}

	return undefined;
}

/**
 * Normalize and include current post terms to the query loop.
 *
 * @since 1.3.0
 * @param {Object} parameters The query params.
 * @return {Object} The query parameters with current post terms.
 */
function normalizeQueryLoopIncludeCurrentPostTerms( parameters ) {
	const currentPost = getCurrentPost();

	if ( !! currentPost && !! parameters?.tax_query ) {
		const taxQuery = parameters.tax_query.map( ( tax ) => {
			if ( tax.terms.includes( 'current-terms' ) ) {
				const terms = tax.terms.concat( currentPost[ tax.rest ] );
				const currentTermsIndex = terms.indexOf( 'current-terms' );

				terms.splice( currentTermsIndex, 1 );

				return Object.assign( {}, tax, { terms } );
			}

			return tax;
		} );

		parameters = Object.assign( {}, parameters, { tax_query: taxQuery } );
	}

	return parameters;
}

/**
 * Normalize and exclude current post terms to the query loop.
 *
 * @since 1.3.0
 * @param {Object} parameters The query params.
 * @return {Object} The query parameters without current post terms.
 */
function normalizeQueryLoopExcludeCurrentPostTerms( parameters ) {
	const currentPost = getCurrentPost();

	if ( !! currentPost && !! parameters?.tax_query_exclude ) {
		const taxQuery = parameters.tax_query_exclude.map( ( tax ) => {
			if ( tax.terms.includes( 'current-terms' ) ) {
				const terms = tax.terms.concat( currentPost[ tax.rest ] );
				const currentTermsIndex = terms.indexOf( 'current-terms' );

				terms.splice( currentTermsIndex, 1 );

				return Object.assign( {}, tax, { terms } );
			}

			return tax;
		} );

		parameters = Object.assign( {}, parameters, { tax_query_exclude: taxQuery } );
	}

	return parameters;
}

/**
 * Add "Current terms" to the taxonomies option.
 *
 * @since 1.3.0
 * @param {Array} taxonomies The taxonomies list.
 * @return {Array} The taxonomies list modified.
 */
function addCurrentTermsOption( taxonomies ) {
	const newTaxonomies = [ ...taxonomies ];

	newTaxonomies.unshift( {
		value: 'current-terms',
		label: __( 'Current post terms', 'generateblocks-pro' ),
	} );

	return newTaxonomies;
}

/**
 * Add rand parameter to the query loop.
 *
 * @since 1.3.0
 * @param {Object} queryParameters The query parameters.
 * @return {Object} The modified query parameters.
 */
function extendOrderByParameter( queryParameters ) {
	return queryParameters.map( ( param ) => {
		if ( 'orderby' === param.id ) {
			return Object.assign( {}, param, {
				selectOptions: [
					...param.selectOptions,
					{ value: 'rand', label: __( 'Random', 'generateblocks-pro' ) },
				],
			} );
		}

		return param;
	} );
}

/**
 * Normalize order by options before calling REST API.
 *
 * @since 1.3.0
 * @param {Object} parameters The query parameters.
 * @return {Object} The modified query parameters.
 */
function normalizeQueryLoopOrderBy( parameters ) {
	if ( 'rand' === parameters?.orderby ) {
		parameters = Object.assign( {}, parameters, { orderby: undefined } );
	}

	return parameters;
}

/**
 * Normalize and exclude current post from the query loop.
 *
 * @since 1.3.0
 * @param {Object} parameters The query params.
 * @return {Object} The query parameters without current post.
 */
function normalizeQueryLoopExcludeCurrentPost( parameters ) {
	const currentPost = getCurrentPost();

	if (
		!! currentPost &&
		!! parameters.exclude &&
		parameters.exclude.includes( 'exclude-current' )
	) {
		const exclude = [ ...parameters.exclude ];
		const excludeCurrentIndex = exclude.indexOf( 'exclude-current' );

		exclude.splice( excludeCurrentIndex, 1 );

		if ( ! exclude.includes( currentPost.id ) && parameters.post_type === currentPost.type ) {
			exclude.push( currentPost.id );
		}

		parameters = Object.assign( {}, parameters, { exclude } );
	}

	return parameters;
}

/**
 * Add "Exclude current post" to exclude posts parameter.
 *
 * @since 1.3.0
 * @param {Array} posts The posts list.
 * @return {Array} The posts list modified.
 */
function addExcludeCurrentOption( posts ) {
	const newPosts = [ ...posts ];

	newPosts.unshift( {
		value: 'exclude-current',
		label: __( 'Exclude current post', 'generateblocks-pro' ),
	} );

	return newPosts;
}

/**
 * Normalize and include children of current post to the query loop.
 *
 * @since 1.3.0
 * @param {Object} parameters The query params.
 * @return {Object} The query parameters with children included.
 */
function normalizeQueryLoopIncludeCurrentParent( parameters ) {
	const currentPost = getCurrentPost();

	if (
		!! currentPost &&
		!! parameters.parent &&
		parameters.parent.includes( 'current-post' )
	) {
		const parent = [ ...parameters.parent ];
		const currentPostIndex = parent.indexOf( 'current-post' );

		parent.splice( currentPostIndex, 1 );

		if ( ! parent.includes( currentPost.id ) && parameters.post_type === currentPost.type ) {
			parent.push( currentPost.id );
		}

		parameters = Object.assign( {}, parameters, { parent } );
	}

	return parameters;
}

/**
 * Add "Current post" to the parent posts parameter.
 *
 * @since 1.3.0
 * @param {Array} posts The posts list.
 * @return {Array} The posts list modified.
 */
function addCurrentParentOption( posts ) {
	const newPosts = [ ...posts ];

	newPosts.unshift( {
		value: 'current-post',
		label: __( 'Current post', 'generateblocks-pro' ),
	} );

	return newPosts;
}

/**
 * Normalize and exclude children of current post to the query loop.
 *
 * @since 1.3.0
 * @param {Object} parameters The query params.
 * @return {Object} The query parameters with children included.
 */
function normalizeQueryLoopExcludeCurrentParent( parameters ) {
	const currentPost = getCurrentPost();

	if (
		!! currentPost &&
		!! parameters.parent_exclude &&
		parameters.parent_exclude.includes( 'current-post' )
	) {
		const parentExclude = [ ...parameters.parent_exclude ];
		const currentPostIndex = parentExclude.indexOf( 'current-post' );

		parentExclude.splice( currentPostIndex, 1 );

		if ( ! parentExclude.includes( currentPost.id ) && parameters.post_type === currentPost.type ) {
			parentExclude.push( currentPost.id );
		}

		parameters = Object.assign( {}, parameters, { parent_exclude: parentExclude } );
	}

	return parameters;
}

/**
 * Normalize and include posts of the current author to the query loop.
 *
 * @since 1.3.0
 * @param {Object} parameters The query params.
 * @return {Object} The query parameters with children included.
 */
function normalizeQueryLoopIncludeCurrentPostAuthor( parameters ) {
	const currentPost = getCurrentPost();

	if (
		!! currentPost &&
		!! parameters.author &&
		parameters.author.includes( 'current-post-author' )
	) {
		const author = [ ...parameters.author ];
		const currentPostIndex = author.indexOf( 'current-post-author' );

		author.splice( currentPostIndex, 1 );

		if ( ! author.includes( currentPost.author ) && parameters.post_type === currentPost.type ) {
			author.push( currentPost.author );
		}

		parameters = Object.assign( {}, parameters, { author } );
	}

	return parameters;
}

/**
 * Normalize and exclude posts of the current author to the query loop.
 *
 * @since 1.3.0
 * @param {Object} parameters The query params.
 * @return {Object} The query parameters with children included.
 */
function normalizeQueryLoopExcludeCurrentPostAuthor( parameters ) {
	const currentPost = getCurrentPost();

	if (
		!! currentPost &&
		!! parameters.author_exclude &&
		parameters.author_exclude.includes( 'current-post-author' )
	) {
		const authorExclude = [ ...parameters.author_exclude ];
		const currentPostIndex = authorExclude.indexOf( 'current-post-author' );

		authorExclude.splice( currentPostIndex, 1 );

		if ( ! authorExclude.includes( currentPost.author ) && parameters.post_type === currentPost.type ) {
			authorExclude.push( currentPost.author );
		}

		parameters = Object.assign( {}, parameters, { author_exclude: authorExclude } );
	}

	return parameters;
}

/**
 * Add "Current post author" to the author parameter.
 *
 * @since 1.3.0
 * @param {Array} posts The authors list.
 * @return {Array} The authors list modified.
 */
function addCurrentPostAuthorOption( posts ) {
	const newPosts = [ ...posts ];

	newPosts.unshift( {
		value: 'current-post-author',
		label: __( 'Current post author', 'generateblocks-pro' ),
	} );

	return newPosts;
}

addFilter(
	'generateblocks.editor.query-loop.normalize-parameters',
	'generateblocks-pro/query-loop/include-current-post-terms',
	normalizeQueryLoopIncludeCurrentPostTerms
);

addFilter(
	'generateblocks.editor.query-loop.normalize-parameters',
	'generateblocks-pro/query-loop/exclude-current-post-terms',
	normalizeQueryLoopExcludeCurrentPostTerms
);

addFilter(
	'generateblocks.editor.taxonomy-parameter-control.tax_query',
	'generateblocks-pro/query-loop/tax-query-taxonomies',
	addCurrentTermsOption
);

addFilter(
	'generateblocks.editor.taxonomy-parameter-control.tax_query_exclude',
	'generateblocks-pro/query-loop/tax-query-taxonomies',
	addCurrentTermsOption
);

addFilter(
	'generateblocks.editor.query-loop.query-parameters',
	'generateblocks-pro/query-loop/query-parameters/order-by',
	extendOrderByParameter
);

addFilter(
	'generateblocks.editor.query-loop.normalize-parameters',
	'generateblocks-pro/query-loop/order-by/random',
	normalizeQueryLoopOrderBy
);

addFilter(
	'generateblocks.editor.query-loop.normalize-parameters',
	'generateblocks-pro/query-loop/exclude-current-post',
	normalizeQueryLoopExcludeCurrentPost
);

addFilter(
	'generateblocks.editor.query-loop.exclude-posts-select',
	'generateblocks-pro/query-loop/exclude-current-post',
	addExcludeCurrentOption
);

addFilter(
	'generateblocks.editor.query-loop.normalize-parameters',
	'generateblocks-pro/query-loop/include-parent-custom-post',
	normalizeQueryLoopIncludeCurrentParent
);

addFilter(
	'generateblocks.editor.query-loop.include-parent',
	'generateblocks-pro/query-loop/include-parent-current-post',
	addCurrentParentOption
);

addFilter(
	'generateblocks.editor.query-loop.normalize-parameters',
	'generateblocks-pro/query-loop/exclude-parent-custom-post',
	normalizeQueryLoopExcludeCurrentParent
);

addFilter(
	'generateblocks.editor.query-loop.exclude-parent',
	'generateblocks-pro/query-loop/exclude-parent-current-post',
	addCurrentParentOption
);

addFilter(
	'generateblocks.editor.query-loop.normalize-parameters',
	'generateblocks-pro/query-loop/include-current-post-author',
	normalizeQueryLoopIncludeCurrentPostAuthor
);

addFilter(
	'generateblocks.editor.query-loop.normalize-parameters',
	'generateblocks-pro/query-loop/exclude-current-post-author',
	normalizeQueryLoopExcludeCurrentPostAuthor
);

addFilter(
	'generateblocks.editor.query-loop.author',
	'generateblocks-pro/query-loop/author-control',
	addCurrentPostAuthorOption
);

addFilter(
	'generateblocks.editor.query-loop.author-exclude',
	'generateblocks-pro/query-loop/author-exclude-control',
	addCurrentPostAuthorOption
);
