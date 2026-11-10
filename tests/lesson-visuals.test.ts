import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonVisuals,segmentBuild,segmentQuery,segmentUpdate,segmentSearch} from '../lib/lesson-visuals.ts';

test('segment tree drawings agree with the example arithmetic',()=>{
  const built=segmentBuild().frames.at(-1)!;
  assert.deepEqual(built.nodes!.map(n=>n.value),['15','9','6','2','7','1','5']);
  assert.equal(segmentQuery().frames.at(-1)!.result,'Respuesta: 7 + 1 = 8');
  const updated=segmentUpdate().frames.at(-1)!.nodes!;
  assert.deepEqual(updated.map(n=>n.value),['11','5','6','2','3','1','5']);
  for(const i of [1,2,3]) {
    const parent=Number(updated.find(n=>n.id===String(i))!.value);
    const children=[2*i,2*i+1].map(id=>Number(updated.find(n=>n.id===String(id))!.value));
    assert.equal(parent,children[0]+children[1]);
  }
});

test('animated room search agrees with scanning from left to right',()=>{
  for(const groups of [[4,3,6],[1,1,1,5,2,2,4],[8,7,5,2,1,1],Array(16).fill(1)]) {
    const capacities=[2,7,1,5];
    const expected=groups.map(group=>{const at=capacities.findIndex(x=>x>=group);if(at>=0)capacities[at]-=group;return at+1;});
    const frames=segmentSearch(groups).frames;
    const actual=frames.flatMap(f=>f.result?.startsWith('Respuesta:')?[Number(f.result.match(/\d+/)![0])]:[]);
    assert.deepEqual(actual,expected);
    const final=frames.at(-1)!.nodes!;
    assert.deepEqual(final.slice(3).map(n=>Number(n.value)),capacities);
    assert.equal(Number(final[0].value),Math.max(...capacities));
  }
});

test('all diagram states have reachable edges and in-range highlighted cells',()=>{
  for(const [id,visual] of Object.entries(lessonVisuals)) {
    assert.ok(visual.frames.length>=2,id);
    for(const frame of visual.frames) {
      assert.ok(frame.title&&frame.explanation,id);
      const ids=new Set(frame.nodes?.map(n=>n.id));
      assert.equal(ids.size,frame.nodes?.length||0,id);
      for(const edge of frame.edges||[])for(const endpoint of edge)assert.ok(ids.has(endpoint),`${id}: ${endpoint}`);
      for(const row of frame.rows||[])for(const index of [...row.highlight||[],...row.muted||[]])assert.ok(index>=0&&index<row.values.length,id);
    }
  }
  assert.equal(lessonVisuals['prefix-sums'].frames.at(-1)!.result,'P[3] − P[1] = 10 − 2 = 8');
  assert.equal(lessonVisuals['bfs'].frames.at(-1)!.result,'Distancia de A a E: 3');
  assert.equal(lessonVisuals['prefix-sums-guide'].frames.at(-1)!.result,'P[3] − P[1] = 8 − 3 = 5');
  assert.equal(lessonVisuals['binary-search-first'].frames.at(-1)!.result,'Primer valor ≥ 4: posición 2');
  const beforeFindingFirst=lessonVisuals['binary-search-first'].frames.at(-2)!.rows![0];
  assert.ok(!beforeFindingFirst.muted?.includes(1),'the saved right boundary remains a possible answer');
  assert.equal(lessonVisuals['bfs-four'].frames.at(-1)!.result,'Distancia de A a D: 2');
  assert.deepEqual(lessonVisuals['bfs-four'].frames[0].edges,[['A','B'],['A','C'],['B','D']]);
  assert.deepEqual(lessonVisuals['bubble-sort'].frames.at(-1)!.rows![0].values,['1','2','3','4']);
  assert.equal(lessonVisuals['dp-stairs'].frames.at(-1)!.result,'Respuesta: 5 maneras');
});
