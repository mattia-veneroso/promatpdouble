const { createClient } = require("@supabase/supabase-js");

function supabase() {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SECRET_KEY
    );
}

function json(statusCode, body) {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        },
        body: JSON.stringify(body)
    };
}

function getBody(event) {
    try {
        return JSON.parse(event.body || "{}");
    } catch {
        return {};
    }
}

module.exports = {
    supabase,
    json,
    getBody
};