// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {GoogleError} from 'google-gax';
import {AckResponse, AckResponses} from './subscriber';

const permanentFailureInvalidAckId = 'PERMANENT_FAILURE_INVALID_ACK_ID';
const transientFailurePrefix = 'TRANSIENT_';

interface StringToString {
  [propname: string]: string;
}

/**
 * Contains information about ack responses that may be used to build
 * responses to user ack calls.
 *
 * @private
 */
export interface AckError {
  transient: boolean;
  response?: AckResponse;
  rawErrorCode: string;
}

export type AckErrorCodes = Map<string, AckError>;

/**
 * Processes the raw RPC information when sending a batch of acks
 * to the Pub/Sub service.
 *
 * @private
 */
export function processAckError(rpcError: GoogleError): AckErrorCodes {
  const ret = new Map<string, AckError>();

  if (!rpcError.errorInfoMetadata) {
    return ret;
  }

  // The typing for errorInfoMetadata is currently incorrect.
  const metadata = rpcError.errorInfoMetadata as StringToString;

  for (const ackId of Object.getOwnPropertyNames(metadata)) {
    const code = metadata[ackId];

    if (code === permanentFailureInvalidAckId) {
      ret.set(ackId, {
        transient: false,
        response: AckResponses.Invalid,
        rawErrorCode: code,
      });
    } else if (code.startsWith(transientFailurePrefix)) {
      ret.set(ackId, {
        transient: true,
        rawErrorCode: code,
      });
    } else {
      ret.set(ackId, {
        transient: false,
        response: AckResponses.Other,
        rawErrorCode: code,
      });
    }
  }

  return ret;
}
