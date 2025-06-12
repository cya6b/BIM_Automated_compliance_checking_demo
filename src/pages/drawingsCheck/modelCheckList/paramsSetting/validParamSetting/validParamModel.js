class validParamModel {
  constructor (val) {
    if (!val) val = {}
    if (val) {
      this.specificationId = val.specificationId || null
      this.specificationName = val.specificationName || ''
      this.articleId = val.articleId || null
      this.articleName = val.articleName || ''
      this.ruleId = val.ruleId || null
      this.ruleName = val.ruleName || ''
      this.elements = val.elements || [{
        elementId: "",
        elementName: '',
        attributes: [
          {
            key: "",
            value: ""
          }
        ]
      }]
    }
  }
}

export default validParamModel
