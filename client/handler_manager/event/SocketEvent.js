'use strict';

/**
 * default event name(connection info)
 * @type {string}
 */

exports.CONNECT = 'connect';

exports.DISCONNECT = 'disconnect';

exports.CONNECT_TIMEOUT = 'connect_timeout';

exports.RECONNECTING = 'reconnecting';

exports.RECONNECT_ERROR = 'reconnect_error';

exports.RECONNECT_FAILED = 'reconnect_failed';

exports.PING = 'ping';

exports.PONG = 'pong';

exports.ERROR = 'error';

exports.RECONNECT_ATTEMPT = 'reconnect_attempt';

exports.RECONNECT = 'reconnect';

/**
 * user define event name
 */

exports.HELLO = 'hello';

exports.TOKENREFRESHREQUIRED = 'toeknRefresh-Required';
exports.BROADCAST_MESSAGE = 'broadcastMessage';
exports.RECEIVE_INVITEUSER = 'receiveInviteUser';