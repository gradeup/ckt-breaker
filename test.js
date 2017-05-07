import test from 'ava';
import fn from './';

const sleep = time => new Promise(resolve => setTimeout(resolve, time));
const noop = () => {};
const getCircuitBreaker = (command, props) => fn(command, props);
const failureCommand = () => Promise.reject(new Error('Failed Command'));
const successAfterNumFail = num => {
	let failCount = num;
	return function () {
		return new Promise((resolve, reject) => {
			if (failCount > 0) {
				failCount -= 1;
				reject(new Error('Failed Command'));
			}

			resolve('success');
		});
	};
};

test('Works with defaults', async t => {
	const ckt = getCircuitBreaker(failureCommand);
	return ckt.fire().catch(err => t.is(err.message, 'Failed Command'));
});

test('Get closed after repeated failed attempts', async t => {
	const ckt = getCircuitBreaker(failureCommand, { maxError: 5, maxTime: 10000 });
	await Promise.all(
			[1, 2, 3, 4, 5].map(val => ckt.fire(val).catch(noop))
	);

	return ckt
		.fire()
		.catch(err => t.is(err.message, 'Service Currently unavailable'));
});

test('Should Retry', async t => {
	const ckt = getCircuitBreaker(failureCommand, { maxError: 5, maxTime: 10000, retry: 1000 });
	t.plan(2);
	await Promise.all([1, 2, 3, 4, 5].map(val => ckt.fire(val).catch(noop)));
	await ckt.fire().catch(err => t.is(err.message, 'Service Currently unavailable'));
	await sleep(2000);
	return ckt.fire().catch(err => t.is(err.message, 'Failed Command'));
});

test('Should timeout', async t => {
	const ckt = getCircuitBreaker(sleep, { maxError: 5, maxTime: 10000, retry: 1000, timeout: 1000 });
	return ckt.fire(2000).catch(err => t.is(err.message, 'Service Timed Out'));
});

test('Should reopen', async t => {
	t.plan(3);
	const ckt = getCircuitBreaker(successAfterNumFail(5), { maxError: 5, maxTime: 10000, retry: 1000, timeout: 1000 });
	await Promise.all([1, 2, 3, 4, 5].map(val => ckt.fire(val).catch(noop)));
	await ckt.fire().catch(err => t.is(err.message, 'Service Currently unavailable'));
	await sleep(1000);
	await ckt.fire().then(val => t.is(val, 'success'));
	return await ckt.fire().then(val => t.is(val, 'success'));
});

test('should fail when no command is passed', t => {
	t.throws(() => getCircuitBreaker());
});
