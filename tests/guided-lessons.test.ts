import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../lib/curriculum.ts';
import {lessonVisuals} from '../lib/lesson-visuals.ts';

test('all 169 lessons have a short guided path and retain their technical chapter',()=>{
  assert.equal(lessons.length,169);
  for(const lesson of lessons) {
    assert.equal(lesson.sections.length,6,`${lesson.id}: six steps`);
    assert.ok(lesson.takeaway&&lesson.takeaway.length>20,`${lesson.id}: takeaway`);
    assert.ok((lesson.detailedSections?.length||0)>=6,`${lesson.id}: technical chapter preserved`);
    assert.ok(lesson.sections.some(s=>s.check),`${lesson.id}: comprehension check`);
    const words=lesson.sections.reduce((count,section)=>count+section.body.split(/\s+/).length,0);
    assert.ok(words>=180&&words<=460,`${lesson.id}: ${words} words`);
    for(const section of lesson.sections) {
      for(const paragraph of section.body.split('\n\n'))assert.ok(paragraph.split(/\s+/).length<=70,`${lesson.id}: long paragraph`);
      if(section.visual)assert.ok(lessonVisuals[section.visual],`${lesson.id}: missing animation ${section.visual}`);
      if(section.check)assert.ok(section.check.question.trim()&&section.check.answer.trim(),lesson.id);
      if(section.picture) {
        assert.ok(section.picture.caption.trim(),lesson.id);
        for(const row of section.picture.rows){
          assert.ok(row.label.trim()&&row.values.length>0&&row.values.length<=8,`${lesson.id}: picture cells`);
          assert.ok(row.values.every(value=>value.trim()),`${lesson.id}: empty cell`);
          for(const index of row.highlight||[])assert.ok(Number.isInteger(index)&&index>=0&&index<row.values.length,`${lesson.id}: picture highlight`);
        }
      }
    }
  }
});
