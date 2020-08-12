/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { MessageConnection, Logger } from 'vscode-jsonrpc';
import { createWebSocketConnection, IWebSocket, IEncoder, IDecoder, NoopEncoder, NoopDecoder } from './socket';
import { ConsoleLogger } from './logger';

export function listen(options: {
    webSocket: WebSocket;
    encoder?: IEncoder;
    decoder?: IDecoder;
    logger?: Logger;
    onConnection: (connection: MessageConnection) => void;
}) {
    const { webSocket, onConnection } = options;
    const logger = options.logger || new ConsoleLogger();
    const encoder = options.encoder || new NoopEncoder();
    const decoder = options.decoder || new NoopDecoder();
    webSocket.onopen = () => {
        const socket = toSocket(webSocket, encoder, decoder);
        const connection = createWebSocketConnection(socket, logger);
        onConnection(connection);
    };
}

export function toSocket(webSocket: WebSocket, encoder: IEncoder, decoder: IDecoder): IWebSocket {
    return {
        send: content => {
          debugger;
          return webSocket.send(encoder.encode(content));
        },
        onMessage: cb => {
          const handler = (event: any) => {
            const data = decoder.decode(event.data);
            if (data) {
              cb(data);   
            }
          };
          webSocket.onmessage = handler;
        },
        onError: cb => webSocket.onerror = event => {
            if ('message' in event) {
                cb((event as any).message)
            }
        },
        onClose: cb => webSocket.onclose = event => cb(event.code, event.reason),
        dispose: () => webSocket.close()
    }
}
