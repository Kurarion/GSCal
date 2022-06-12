import { PercentPipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NoCommaPipe } from 'src/app/shared/pipe/no-comma.pipe';
import { CalculatorService, character, CharacterService, CharSkill, CharSkillDescObject, CharSkills, Const, TYPE_SYS_LANG } from 'src/app/shared/shared.module';

interface levelOption {
  level: string;
  levelNum: number;
}

@Component({
  selector: 'app-talent',
  templateUrl: './talent.component.html',
  styleUrls: ['./talent.component.css']
})
export class TalentComponent implements OnInit {

  private readonly minLevel = 1;
  private readonly maxLevel = 15;
  private readonly defaultLevel = 10;

  readonly skills = ['normal', 'skill', 'elemental_burst'];
  readonly otherSkills = ['other'];
  readonly prundSkills = ['proudSkills']
  readonly levelPadNum = 2;

  readonly props = Const.PROPS_CHARA_ENEMY_BASE;
  readonly props_sub = Const.PROPS_CHARA_WEAPON_SUB;
  readonly percent_props = Const.PROPS_CHARA_WEAPON_PERCENT;

  //キャラデータ
  @Input('data') data!: character;
  //言語
  @Input('language') currentLanguage!: TYPE_SYS_LANG;
  //レベルオプションリスト
  levelOptions: levelOption[] = [];
  //選択されたレベルリスト
  selectedLevels: Record<string, levelOption> = {};

  constructor(private percentPipe: PercentPipe, 
    private decimalPipe: DecimalPipe, 
    private noCommaPipe: NoCommaPipe, 
    private characterService: CharacterService,
    private calculatorService: CalculatorService) { }

  ngOnInit(): void {
    //レベル初期設定
    for (let i = this.minLevel; i <= this.maxLevel; ++i) {
      this.levelOptions.push({
        level: i.toString().padStart(this.levelPadNum, '0'),
        levelNum: i,
      });
    }
    // this.selectedLevels = Array.from({ length: this.skills.length }).map((_, i) => this.levelOptions[this.defaultLevel - 1]);
    for (let key of this.skills) {
      //初期選択
      let temp: levelOption;
      switch (key) {
        case "normal":
          temp = this.getLevelFromString(this.characterService.getNormalLevel(this.data.id)) ?? this.levelOptions[this.defaultLevel - 1];
          break;
        case "skill":
          temp = this.getLevelFromString(this.characterService.getSkillLevel(this.data.id)) ?? this.levelOptions[this.defaultLevel - 1];
          break;
        case "elemental_burst":
          temp = this.getLevelFromString(this.characterService.getElementalBurstLevel(this.data.id)) ?? this.levelOptions[this.defaultLevel - 1];
          break;
      }
      this.selectedLevels[key] = temp!;
      //初期データ更新
      this.onChangeLevel(key, this.selectedLevels[key], true);
    }
    //スキルレベル初期化
    this.calculatorService.initExtraCharacterData(this.data.id);
  }

  onChangeLevel(propName: string, value: levelOption, withoutInitExtra: boolean = false) {
    switch (propName) {
      case "normal":
        this.characterService.setNormalLevel(this.data.id, value.level);
        break;
      case "skill":
        this.characterService.setSkillLevel(this.data.id, value.level);
        break;
      case "elemental_burst":
        this.characterService.setElementalBurstLevel(this.data.id, value.level);
        break;
    }
    if(!withoutInitExtra){
      //更新
      this.calculatorService.initExtraCharacterData(this.data.id);
    }
  }

  getDataProperty(key: string): CharSkill {
    return this.data.skills[key as keyof CharSkills] as CharSkill;
  }

  getDataProperties(key: string): CharSkill[] {
    return this.data.skills[key as keyof CharSkills] as CharSkill[];
  }

  getCharSkillDescObject(key: string, lang: TYPE_SYS_LANG): CharSkillDescObject[] {
    return this.getDataProperty(key).paramDescSplitedList[lang];
  }

  getTalentValue(key: string, obj: CharSkillDescObject, lang: TYPE_SYS_LANG, currentLevel: string, withOrigin: boolean = false): string {
    let result = obj.prefix;
    let values: string[] = [];
    obj.valuePropIndexs.forEach((index: number, i: number) => {
      let value: string | number = (this.data.skills[key as keyof CharSkills] as CharSkill).paramMap[currentLevel][index];
      if (!withOrigin) {
        if (obj.isPercent[i]) {
          value = this.percentPipe.transform(value, '1.0-1') as string;
        } else {
          value = this.noCommaPipe.transform(this.decimalPipe.transform(value, '1.0-1') as string);
        }
      }
      values.push(`${value}`);
    })
    let middlesLength = 0;
    let middlesMaxLength = obj.middles.length;
    for (let i = 0; i < values.length; ++i) {
      result += values[i];
      if (middlesLength < middlesMaxLength) {
        result += obj.middles[middlesLength++];
      }
    }
    result += obj.suffix;

    return result;
  }

  private getLevelFromString(level: string | undefined) {
    if (!level) {
      return undefined;
    }

    return this.levelOptions[parseInt(level) - 1];
  }
}
