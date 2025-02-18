/**************************************************************************
 *  (C) Copyright ModusBox Inc. 2019 - All rights reserved.               *
 *                                                                        *
 *  This file is made available under the terms of the license agreement  *
 *  specified in the corresponding source code repository.                *
 *                                                                        *
 *  ORIGINAL AUTHOR:                                                      *
 *       James Bush - james.bush@modusbox.com                             *
 **************************************************************************/

'use strict';

const util = require('util');
const { MojaloopRequests, Errors } = jest.requireActual('@mojaloop/sdk-standard-components');


class MockMojaloopRequests extends MojaloopRequests {
    constructor(...args) {
        super(...args);
        MockMojaloopRequests.__instance = this;
        this.postParticipants = MockMojaloopRequests.__postParticipants;
        this.getParties = MockMojaloopRequests.__getParties;
        this.postQuotes = MockMojaloopRequests.__postQuotes;
        this.putQuotes = MockMojaloopRequests.__putQuotes;
        this.putQuotesError = MockMojaloopRequests.__putQuotesError;
        this.postTransfers = MockMojaloopRequests.__postTransfers;
        this.putTransfersError = MockMojaloopRequests.__putTransfersError;
    }
}
MockMojaloopRequests.__postParticipants = jest.fn(() => Promise.resolve());
MockMojaloopRequests.__getParties = jest.fn(() => Promise.resolve());
MockMojaloopRequests.__postQuotes = jest.fn(() => Promise.resolve());
MockMojaloopRequests.__putQuotes = jest.fn(() => Promise.resolve());
MockMojaloopRequests.__putQuotesError = jest.fn(() => Promise.resolve());
MockMojaloopRequests.__postTransfers = jest.fn(() => Promise.resolve());
MockMojaloopRequests.__putTransfersError = jest.fn(() => Promise.resolve());

class MockIlp {
    constructor(config) {
        console.log('MockIlp constructed');
        this.config = config;
    }

    caluclateFulfil(ilpPacket) {
        console.log(`Mock ILP not calculating fulfil from ilp packet ${ilpPacket}`);
        return 'mockGeneratedFulfilment';
    }

    calculateConditionFromFulfil(fulfil) {
        console.log(`Mock ILP not calculating condition from fulfil ${fulfil}`);
        return 'mockGeneratedCondition';
    }

    validateFulfil(fulfil, condition) {
        console.log(`Mock ILP not checking fulfil ${fulfil} against condition ${condition}`);
        return true;
    }

    getQuoteResponseIlp(...args) {
        console.log(`MockIlp.getQuoteResponseIlp called with args: ${util.inspect(args)}`);

        return {
            fulfilment: 'mockGeneratedFulfilment',
            ilpPacket: 'mockBase64encodedIlpPacket',
            condition: 'mockGeneratedCondition'
        };
    }
}

const MockJwsValidator = jest.fn().mockImplementation(() => {
    return {validate: MockJwsValidator.__validate};
});
MockJwsValidator.__validate = jest.fn(() => true);


class MockJwsSigner {
    constructor(config) {
        this.config = config;
        console.log(`MockJwsSigner constructed with config: ${util.inspect(config)}`);
    }
}


module.exports = {
    MojaloopRequests: MockMojaloopRequests,
    Ilp: MockIlp,
    Jws: {
        validator: MockJwsValidator,
        signer: MockJwsSigner
    },
    Errors: Errors
};
