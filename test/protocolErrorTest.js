/* eslint-env mocha */

const assert = require('assert')
const Client = require('../src/client')

describe('protocol parser errors', () => {
  it('emits one diagnostic error and closes the client', () => {
    const client = new Client(false, '26.1')
    const errors = []
    client.on('error', error => errors.push(error))

    const parseError = new Error('Invalid array length')
    parseError.field = 'packet.params.entries'
    parseError.buffer = Buffer.from([0x2a, 0xff, 0xff])
    client.deserializer.emit('error', parseError)
    client.deserializer.emit('error', parseError)

    assert.strictEqual(errors.length, 1)
    assert.strictEqual(errors[0].protocolVersion, '26.1')
    assert.strictEqual(errors[0].packetId, '0x2a')
    assert.match(errors[0].message, /protocol 26\.1, packet 0x2a/)
  })
})
