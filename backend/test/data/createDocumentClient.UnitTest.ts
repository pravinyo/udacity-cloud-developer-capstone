import { expect } from 'chai';
import 'mocha';
import { createDynamoDBClient } from '../../src/data/createDynamoDBClient';
import { DocumentClient } from 'aws-sdk/clients/dynamodb'


describe('create document client function', () => {
    let env: NodeJS.ProcessEnv

    beforeEach = ()=>{
        env = process.env
    }

    it('should use remote client', () => {
        const client = createDynamoDBClient()
        expect(client).instanceOf(DocumentClient);
    });

    it('should use local client', () => {
        process.env.IS_OFFLINE="true"
        const client = createDynamoDBClient()
        expect(client).instanceOf(DocumentClient);
    });

    afterEach = ()=>{
        process.env = env
    }
  });
  