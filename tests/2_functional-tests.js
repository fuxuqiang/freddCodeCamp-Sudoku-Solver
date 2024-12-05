const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('Solve a puzzle with valid puzzle string', (done) => {
        chai
          .request(server)
          .post('/api/solve')
          .send({
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
          })
          .end((err, res) => {
            assert.isString(res.body.solution);
            done();
          });
    });
    test('Solve a puzzle with missing puzzle string', (done) => {
        chai
          .request(server)
          .post('/api/solve')
          .end((err, res) => {
            assert.equal(res.body.error, 'Required field missing');
            done();
          });
    });
    test('Solve a puzzle with invalid characters', (done) => {
        chai
          .request(server)
          .post('/api/solve')
          .send({
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.0'
          })
          .end((err, res) => {
            assert.equal(res.body.error, 'Invalid characters in puzzle');
            done();
          });
    });
    test('Solve a puzzle with incorrect lenght', (done) => {
        chai
          .request(server)
          .post('/api/solve')
          .send({
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.'
          })
          .end((err, res) => {
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
            done();
          });
    });
    test('Solve a puzzle that cannot be solved', (done) => {
        chai
          .request(server)
          .post('/api/solve')
          .send({
            puzzle: '3.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
          })
          .end((err, res) => {
            assert.equal(res.body.error, 'Puzzle cannot be solved');
            done();
          });
    });
    test('Check a puzzle placement with all fields', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            coordinate: 'A1',
            value: 7
          })
          .end((err, res) => {
            assert.isBoolean(res.body.valid);
            done();
          });
    });
    test('Check a puzzle placement with single placement conflict', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            coordinate: 'A1',
            value: 2
          })
          .end((err, res) => {
            assert.lengthOf(res.body.conflict, 1);
            done();
          });
    });
    test('Check a puzzle placement with multiple placement conflicts', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            coordinate: 'A1',
            value: 1
          })
          .end((err, res) => {
            assert.lengthOf(res.body.conflict, 2);
            done();
          });
    });
    test('Check a puzzle placement with all placement conflicts', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            coordinate: 'A1',
            value: 5
          })
          .end((err, res) => {
            assert.lengthOf(res.body.conflict, 3);
            done();
          });
    });
    test('Check a puzzle placement with missing required fields', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .end((err, res) => {
            assert.equal(res.body.error, 'Required field(s) missing');
            done();
          });
    });
    test('Check a puzzle placement with invalid characters', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.0',
            coordinate: 'A1',
            value: 5
          })
          .end((err, res) => {
            assert.equal(res.body.error, 'Invalid characters in puzzle');
            done();
          });
    });
    test('Check a puzzle placement with invalid characters', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.',
            coordinate: 'A1',
            value: 5
          })
          .end((err, res) => {
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
            done();
          });
    });
    test('Check a puzzle placement with invalid placement value', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            coordinate: 'A1',
            value: 10
          })
          .end((err, res) => {
            assert.equal(res.body.error, 'Invalid value');
            done();
          });
    });
});

