import { expect } from 'chai';
import 'mocha';
import { parseUserId } from '../../src/auth/utils';

const token1= `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNvaHpJNjdXaHlZVlNSbGhpTElKUiJ9.eyJpc3MiOiJodHRwczovL3ByYXZpbi1kZXYuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTEyNTY3NDMxOTc5MTE3NTMzODY0IiwiYXVkIjoiOGtkczJicUc2NmRtaDRHRU9ka1hzRjhUNTNxUVJxN3IiLCJpYXQiOjE1ODYyNDY0ODIsImV4cCI6MTU4NjY3ODQ4MiwiYXRfaGFzaCI6ImpTRi1rbUZQYjRaajN2dTRaRFFlNFEiLCJub25jZSI6InBTeXRSUmdVWVJtYVFKd3diQWZ5bEd1NFFfZ1RCODF3In0.uDa73l4nQrHSQYy-RaboNRagjW7OkczHSnOBQe7q3_NRi4UJzP4DVaWa-LU_hhLR1NtmFDCZQE45ovLTmuFuMHQf_YDmdzi6b5vIGyAGL89yxnHmHkffiygX0-ccDCX_WoWeUnG7nzcplhzlRBq5iXmCPus64T7cR8d7baMBP67cDt7EP66eOiO4DNiEvwU_Vp4ass0W9vV03NBt-8Df7EIRKHT7o8YPNfhd0qeefx5pJzPEwfLY-3iM8iJ6KsKvqspZyovV2buIa4C1BCbtmFoLoshen8p6GJxGroeotluviqnJGFooCWEbVUqum5hD94yjvjqGngF945NOJW47Dw`
const token2= ""
const token3 = `eyJhbGciOiJIUzI1NiIsInR5cCI.6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
describe('parse userId', () => {

    it('should return correct userId', () => {
      const userId = parseUserId(token1)
      expect(userId).to.equal(`google-oauth2|112567431979117533864`);
    });
  
    it('should return null for empty token', () => {
        const userId = parseUserId(token2)
        expect(userId).to.equal(null);
    });

    it('should return null for malformed token', () => {
        const userId = parseUserId(token3)
        expect(userId).to.equal(null);
    });
  
  });
  