export default async (request, context) => {
    // Get the original response
    const response = await context.next();

    // Clone the response so we can modify it
    let newResponse = new Response(response.body, response);

    // Generate a random nonce
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const nonce = Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');

    // Modify the CSP header to include the nonce
    let csp = newResponse.headers.get('Content-Security-Policy');

    if (csp) {
        // Append 'nonce-{nonce}' to script-src and script-src-elem directives
        csp = csp.replace(
            /(script-src[^;]*)(;|$)/,
            (match, p1, p2) => `${p1} 'nonce-${nonce}'${p2}`
        );
        csp = csp.replace(
            /(script-src-elem[^;]*)(;|$)/,
            (match, p1, p2) => `${p1} 'nonce-${nonce}'${p2}`
        );

        // Update the header
        newResponse.headers.set('Content-Security-Policy', csp);
    }

    // If the response is HTML, inject the nonce into script tags
    const contentType = newResponse.headers.get('Content-Type');
    if (contentType && contentType.includes('text/html')) {
        let text = await newResponse.text();

        // Add nonce attribute to script tags that don't have it
        text = text.replace(
            /<script(?![^>]*\bnonce=)([^>]*)>/g,
            `<script nonce="${nonce}"$1>`
        );

        // Return the modified response
        newResponse = new Response(text, newResponse);
    }
    console.log('[netlify/edge-functions]::inject-csp-nonce.js -- New Response CSP:', newResponse)
    return newResponse;
};
