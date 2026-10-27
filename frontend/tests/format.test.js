import test from 'node:test'
import assert from 'node:assert/strict'
import { apiDate, formatVolume } from '../src/utils/format.js'

test('formatVolume keeps small amounts in milliliters', () => {
  assert.equal(formatVolume(750), '750 mL')
})

test('formatVolume presents larger amounts in liters', () => {
  assert.equal(formatVolume(1500), '1.5 L')
  assert.equal(formatVolume(2000), '2 L')
})

test('apiDate produces a local YYYY-MM-DD value', () => {
  assert.equal(apiDate(new Date(2026, 9, 7, 12, 0)), '2026-10-07')
})
